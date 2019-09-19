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
	sys
} from 'typescript';
import {Diagnostic, DiagnosticCode, Context, Location, RunResults} from './interfaces';

// List of diagnostic codes that should be ignored
const ignoredDiagnostics = new Set<number>([
	DiagnosticCode.AwaitIsOnlyAllowedInAsyncFunction
]);

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
 * Extract all the `expectError` statements and convert it to a range map.
 *
 * @param program - The TypeScript program.
 */
const extractExpectErrorRanges = (program: Program) => {
	const expectedErrors = new Map<Location, Pick<Diagnostic, 'fileName' | 'line' | 'column'>>();

	function walkNodes(node: Node) {
		if (node.kind === SyntaxKind.ExpressionStatement && node.getText().startsWith('expectError')) {
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

		forEachChild(node, walkNodes);
	}

	for (const sourceFile of program.getSourceFiles()) {
		walkNodes(sourceFile);
	}

	return expectedErrors;
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
 * Get a list of TypeScript diagnostics for a program
 *
 * @param program - A set-up TypeScript Program
 * @returns An array of diagnostics
 */
export const getDiagnostics = (program: Program) => {
	const results: Diagnostic[] = [];

		const diagnostics = program
		.getSemanticDiagnostics()
		.concat(program.getSyntacticDiagnostics());

	const expectedErrors = extractExpectErrorRanges(program);

	for (const diagnostic of diagnostics) {
		if (!diagnostic.file || ignoreDiagnostic(diagnostic, expectedErrors)) {
			continue;
		}

		const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start as number);

		results.push({
			fileName: diagnostic.file.fileName,
			message: flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
			severity: 'error',
			line: position.line + 1,
			column: position.character
		});
	}

	for (const [, diagnostic] of expectedErrors) {
		results.push({
			...diagnostic,
			message: 'Expected an error, but found none.',
			severity: 'error'
		});
	}

	return results;
};

/**
 * Get a list of TypeScript diagnostics, and memory size within the current context.
 *
 * @param context - The context object.
 * @returns An object with memory stats, and diagnostics
 */
export const getTypeScriptResults = (context: Context): RunResults => {
	const fileNames = context.testFiles.map(fileName => path.join(context.options.cwd, fileName));

	const program = createProgram(fileNames, context.config.compilerOptions);
	const diagnostics = getDiagnostics(program);

	// These are private as of 3.6, but will be public in 3.7 - microsoft/TypeScript#33400
	const programAny = program as any;
	const sysAny = sys as any;
	const stats = {
		typeCount: programAny.getTypeCount && programAny.getTypeCount(),
		memoryUsage: sysAny.getMemoryUsage && sysAny.getMemoryUsage(),
		relationCacheSizes: programAny.getRelationCacheSizes && programAny.getRelationCacheSizes(),
	};

	return {diagnostics , stats};
};
