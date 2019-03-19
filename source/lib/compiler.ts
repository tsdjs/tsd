import * as path from 'path';
import {flattenDiagnosticMessageText, createProgram, SyntaxKind, Diagnostic as TSDiagnostic, Program, SourceFile} from 'typescript';
import {Diagnostic, DiagnosticCode, Context, Location} from './interfaces';

// List of diagnostic codes that should be ignored
const ignoredDiagnostics = new Set<number>([
	DiagnosticCode.AwaitIsOnlyAllowedInAsyncFunction
]);

const diagnosticCodesToIgnore = new Set<DiagnosticCode>([
	DiagnosticCode.ArgumentTypeIsNotAssignableToParameterType,
	DiagnosticCode.PropertyDoesNotExistOnType,
	DiagnosticCode.CannotAssignToReadOnlyProperty
]);

/**
 * Extract all the `expectError` statements and convert it to a range map.
 *
 * @param program - The TypeScript program.
 */
const extractExpectErrorRanges = (program: Program) => {
	const expectedErrors = new Map<Location, Pick<Diagnostic, 'fileName' | 'line' | 'column'>>();

	for (const sourceFile of program.getSourceFiles()) {
		for (const statement of sourceFile.statements) {
			if (statement.kind !== SyntaxKind.ExpressionStatement || !statement.getText().startsWith('expectError')) {
				continue;
			}

			const location = {
				fileName: statement.getSourceFile().fileName,
				start: statement.getStart(),
				end: statement.getEnd()
			};

			const pos = statement.getSourceFile().getLineAndCharacterOfPosition(statement.getStart());

			expectedErrors.set(location, {
				fileName: location.fileName,
				line: pos.line + 1,
				column: pos.character
			});
		}
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

	const expectedErrors = extractExpectErrorRanges(program);

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
