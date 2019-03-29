import * as path from 'path';
import {
	flattenDiagnosticMessageText,
	createProgram,
	SyntaxKind,
	Diagnostic as TSDiagnostic,
	Program,
	SourceFile,
	Node,
	forEachChild,
	ExpressionStatement,
	CallExpression
} from 'typescript';
import {Diagnostic, DiagnosticCode, Context, Location} from './interfaces';

type SourceCodeLocation = Pick<Diagnostic, 'fileName' | 'line' | 'column'>;

/**
 * List of diagnostic codes that should be ignored.
 */
const ignoredDiagnostics = new Set<number>([
	DiagnosticCode.AwaitIsOnlyAllowedInAsyncFunction
]);

/**
 * List of diagnostic codes that should be ignored when part of an `expectError` statement.
 */
const expectErrorRelevantDignosticCodes = new Set<DiagnosticCode>([
	DiagnosticCode.ArgumentTypeIsNotAssignableToParameterType,
	DiagnosticCode.PropertyDoesNotExistOnType,
	DiagnosticCode.CannotAssignToReadOnlyProperty
]);

const locationFromNode = (node: Node): SourceCodeLocation => {
	const pos = node
		.getSourceFile()
		.getLineAndCharacterOfPosition(node.getStart());

	return {
		fileName: node.getSourceFile().fileName,
		line: pos.line + 1,
		column: pos.character + 1
	};
};

const isExpressionStatement = (node: Node): node is ExpressionStatement =>
	node.kind === SyntaxKind.ExpressionStatement;

const isCallExpression = (node: Node): node is CallExpression =>
	node.kind === SyntaxKind.CallExpression;

/**
 * For `expectType` statements, extract source code location data.
 *
 * @param node - The node to examine.
 */
const extractExpectTypeDataForNode = (node: Node): { node: CallExpression; location: SourceCodeLocation } | null => {
	if (!isExpressionStatement(node) || !node.getText().startsWith('expectType')) {
		return null;
	}

	if (!isCallExpression(node.expression)) {
		return null;
	}

	return {
		node: node.expression,
		location: locationFromNode(node.expression)
	};
};

/**
 * For `expectError` statements, extract range and source code location data.
 *
 * @param node - The node to examine.
 */
const extractExpectErrorDataForNode = (node: Node) => {
	if (!isExpressionStatement(node) || !node.getText().startsWith('expectError')) {
		return null;
	}

	const location = {
		fileName: node.getSourceFile().fileName,
		start: node.getStart(),
		end: node.getEnd()
	};

	return {
		location,
		locationData: locationFromNode(node)
	};
};

/**
 * Extract all the `expectType` and `expectError` statements.
 *
 * @param program - The TypeScript program.
 */
const extractExpectations = (program: Program) => {
	const expectTypeLocationData = new Map<CallExpression, SourceCodeLocation>();
	const expectErrorLocationData = new Map<Location, SourceCodeLocation>();

	function walkNodes(node: Node) {
		const expectTypeNodeData = extractExpectTypeDataForNode(node);
		if (expectTypeNodeData) {
			expectTypeLocationData.set(expectTypeNodeData.node, expectTypeNodeData.location);
		}

		const expectedErrorData = extractExpectErrorDataForNode(node);
		if (expectedErrorData) {
			expectErrorLocationData.set(expectedErrorData.location, expectedErrorData.locationData);
		}

		forEachChild(node, walkNodes);
	}

	for (const sourceFile of program.getSourceFiles()) {
		if (!sourceFile.isDeclarationFile) {
			walkNodes(sourceFile);
		}
	}

	return {
		expectTypeLocationData,
		expectErrorLocationData
	};
};

/**
 * Checks whether a disagnostic reports the same error as a previously collected exact type mismatch error.
 *
 * @param diagnostic - The diagnostic to validate.
 * @param expectTypeFileName - The filename of `expectType` assertion.
 * @param expectTypeFirstArgumentNode - The node of the `expectType` argument.
 */
const diagnosticMatchesExpectTypeAssertion =
	(diagnostic: TSDiagnostic, expectTypeFileName: string, expectTypeFirstArgumentNode: Node) => {
		if (
			diagnostic.code !== DiagnosticCode.ArgumentTypeIsNotAssignableToParameterType ||
			!diagnostic.file ||
			diagnostic.file.fileName !== expectTypeFileName
		) {
			return false;
		}

		if (
			diagnostic.start === expectTypeFirstArgumentNode.getStart() &&
			// tslint:disable-next-line: no-non-null-assertion
			diagnostic.start + diagnostic.length! === expectTypeFirstArgumentNode.getEnd()
		) {
			return true;
		}

		return false;
	};

/**
 * Check if the provided diagnostic should be ignored.
 *
 * @param diagnostic - The diagnostic to validate.
 * @param expectedErrors - Map of the expected errors.
 * @return Boolean indicating if the diagnostic should be ignored or not.
 */
const ignoreDiagnostic = (diagnostic: TSDiagnostic, expectedErrors: Map<Location, any>): boolean => {
	if (ignoredDiagnostics.has(diagnostic.code)) {
		// Filter out diagnostics which are present in the `ignoredDiagnostics` set
		return true;
	}

	if (!expectErrorRelevantDignosticCodes.has(diagnostic.code)) {
		return false;
	}

	const diagnosticFileName = (diagnostic.file as SourceFile).fileName;

	for (const [location] of expectedErrors) {
		const start = diagnostic.start as number;

		if (diagnosticFileName === location.fileName && start > location.start && start < location.end) {
			// Remove the expected error from the Map so it's not being reported as failure
			expectedErrors.delete(location);
			return true;
		}
	}

	return false;
};

/**
 * Get a list of TypeScript diagnostics within the current context.
 *
 * @param context - The context object.
 * @returns List of diagnostics
 */
export const getDiagnostics = (context: Context): Diagnostic[] => {
	const fileNames = context.testFiles.map(fileName => path.join(context.cwd, fileName));

	const result: Diagnostic[] = [];

	const program = createProgram(fileNames, context.config.compilerOptions);
	const checker = program.getTypeChecker();

	let diagnostics = program
		.getSemanticDiagnostics()
		.concat(program.getSyntacticDiagnostics());

	const {expectTypeLocationData, expectErrorLocationData} = extractExpectations(program);

	for (const [expectTypeNode, expectTypeNodeLocation] of expectTypeLocationData.entries()) {
		if (!expectTypeNode.typeArguments || !expectTypeNode.typeArguments[0] || !expectTypeNode.arguments[0]) {
			continue;
		}

		const firstTypeArgumentNode = expectTypeNode.typeArguments[0];
		const firstArgumentNode = expectTypeNode.arguments[0];

		const typeArgumentType = checker.typeToString(checker.getTypeFromTypeNode(firstTypeArgumentNode));
		const parameterType = checker.typeToString(checker.getTypeAtLocation(firstArgumentNode));

		if (typeArgumentType === parameterType) {
			continue;
		}

		result.push({
			...expectTypeNodeLocation,
			message: `Expected type: '${typeArgumentType}', got: '${parameterType}' from expression '${expectTypeNode.arguments[0].getText()}'.`,
			severity: 'error'
		});

		diagnostics = diagnostics.filter(diagnostic =>
			!diagnosticMatchesExpectTypeAssertion(diagnostic, expectTypeNodeLocation.fileName, firstArgumentNode)
		);
	}

	for (const diagnostic of diagnostics) {
		if (!diagnostic.file || ignoreDiagnostic(diagnostic, expectErrorLocationData)) {
			continue;
		}

		// tslint:disable-next-line: no-non-null-assertion
		const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);

		result.push({
			fileName: diagnostic.file.fileName,
			line: position.line + 1,
			column: position.character + 1,
			message: flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
			severity: 'error'
		});
	}

	for (const [, expectedErrorLocation] of expectErrorLocationData) {
		result.push({
			...expectedErrorLocation,
			message: 'Expected an error, but found none.',
			severity: 'error'
		});
	}

	return result;
};
