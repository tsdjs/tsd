import * as path from 'path';
import {
	flattenDiagnosticMessageText,
	createProgram,
	Diagnostic as TSDiagnostic,
	Program,
	SourceFile,
	Node,
	forEachChild,
	isCallExpression,
	Identifier,
	TypeChecker,
	CallExpression
} from '../../libraries/typescript';
import {Diagnostic, DiagnosticCode, Context, Location} from './interfaces';

// List of diagnostic codes that should be ignored in general
const ignoredDiagnostics = new Set<number>([
	DiagnosticCode.AwaitIsOnlyAllowedInAsyncFunction
]);

// List of diagnostic codes which should be ignored inside `expectError` statements
const diagnosticCodesToIgnore = new Set<DiagnosticCode>([
	DiagnosticCode.ArgumentTypeIsNotAssignableToParameterType,
	DiagnosticCode.PropertyDoesNotExistOnType,
	DiagnosticCode.CannotAssignToReadOnlyProperty,
	DiagnosticCode.TypeIsNotAssignableToOtherType,
	DiagnosticCode.GenericTypeRequiresTypeArguments,
	DiagnosticCode.ExpectedArgumentsButGotOther,
	DiagnosticCode.NoOverloadMatches
]);

/**
 * Extract all assertions.
 *
 * @param program - TypeScript program.
 */
const extractAssertions = (program: Program) => {
	const typeAssertions = new Set<CallExpression>();
	const errorAssertions = new Set<CallExpression>();

	function walkNodes(node: Node) {
		if (isCallExpression(node)) {
			const text = (node.expression as Identifier).getText();

			if (text === 'expectType') {
				typeAssertions.add(node);
			} else if (text === 'expectError') {
				errorAssertions.add(node);
			}
		}

		forEachChild(node, walkNodes);
	}

	for (const sourceFile of program.getSourceFiles()) {
		walkNodes(sourceFile);
	}

	return {
		typeAssertions,
		errorAssertions
	};
};

/**
 * Loop over all the `expectError` nodes and convert them to a range map.
 *
 * @param nodes - Set of `expectError` nodes.
 */
const extractExpectErrorRanges = (nodes: Set<Node>) => {
	const expectedErrors = new Map<Location, Pick<Diagnostic, 'fileName' | 'line' | 'column'>>();

	// Iterate over the nodes and add the node range to the map
	for (const node of nodes) {
		const location = {
			fileName: node.getSourceFile().fileName,
			start: node.getStart(),
			end: node.getEnd()
		};

		const pos = node
			.getSourceFile()
			.getLineAndCharacterOfPosition(node.getStart());

		expectedErrors.set(location, {
			fileName: location.fileName,
			line: pos.line + 1,
			column: pos.character
		});
	}

	return expectedErrors;
};

/**
 * Assert the expected type from `expectType` calls with the provided type in the argument.
 * Returns a list of custom diagnostics.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectType` AST nodes.
 * @return List of custom diagnostics.
 */
const assertTypes = (checker: TypeChecker, nodes: Set<CallExpression>): Diagnostic[] => {
	const diagnostics: Diagnostic[] = [];

	for (const node of nodes) {
		if (!node.typeArguments) {
			// Skip if the node does not have generics
			continue;
		}

		// Retrieve the type to be expected. This is the type inside the generic.
		const expectedType = checker.getTypeFromTypeNode(node.typeArguments[0]);
		const argumentType = checker.getTypeAtLocation(node.arguments[0]);

		if (!checker.isAssignableTo(argumentType, expectedType)) {
			// The argument type is not assignable to the expected type. TypeScript will catch this for us.
			continue;
		}

		if (!checker.isAssignableTo(expectedType, argumentType)) { // tslint:disable-line:early-exit
			/**
			 * At this point, the expected type is not assignable to the argument type, but the argument type is
			 * assignable to the expected type. This means our type is too wide.
			 */
			const position = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart());

			diagnostics.push({
				fileName: node.getSourceFile().fileName,
				message: `Parameter type \`${checker.typeToString(expectedType)}\` is declared too wide for argument type \`${checker.typeToString(argumentType)}\`.`,
				severity: 'error',
				line: position.line + 1,
				column: position.character,
			});
		}
	}

	return diagnostics;
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

	if (!diagnosticCodesToIgnore.has(diagnostic.code)) {
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

	const diagnostics = program
		.getSemanticDiagnostics()
		.concat(program.getSyntacticDiagnostics());

	const {typeAssertions, errorAssertions} = extractAssertions(program);

	const expectedErrors = extractExpectErrorRanges(errorAssertions);

	result.push(...assertTypes(program.getTypeChecker(), typeAssertions));

	for (const diagnostic of diagnostics) {
		if (!diagnostic.file || ignoreDiagnostic(diagnostic, expectedErrors)) {
			continue;
		}

		const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start as number);

		result.push({
			fileName: diagnostic.file.fileName,
			message: flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
			severity: 'error',
			line: position.line + 1,
			column: position.character
		});
	}

	for (const [, diagnostic] of expectedErrors) {
		result.push({
			...diagnostic,
			message: 'Expected an error, but found none.',
			severity: 'error'
		});
	}

	return result;
};
