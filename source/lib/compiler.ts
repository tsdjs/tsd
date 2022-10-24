import {
	flattenDiagnosticMessageText,
	createProgram,
	Diagnostic as TSDiagnostic,
	SourceFile
} from '../../libraries/typescript';
import {TypeChecker} from './entities/typescript';
import {extractAssertions, parseErrorAssertionToLocation} from './parser';
import {Diagnostic, DiagnosticCode, Context, Location, ExtendedDiagnostic} from './interfaces';
import {handle} from './assertions';

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
 * Check if the provided diagnostic should be ignored.
 *
 * @param diagnostic - The diagnostic to validate.
 * @param expectedErrors - Map of the expected errors.
 * @returns Boolean indicating if the diagnostic should be ignored or not.
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
export const getDiagnostics = (context: Context): ExtendedDiagnostic => {
	let numTests: number = 0;
	const diagnostics: Diagnostic[] = [];

	const program = createProgram(context.testFiles, context.config.compilerOptions);

	const tsDiagnostics = program
		.getSemanticDiagnostics()
		.concat(program.getSyntacticDiagnostics());

	const assertions = extractAssertions(program);

	for (const assertion of assertions) {
		numTests = numTests + assertion[1].size;
	}

	diagnostics.push(...handle(program.getTypeChecker() as TypeChecker, assertions));

	const expectedErrors = parseErrorAssertionToLocation(assertions);

	for (const diagnostic of tsDiagnostics) {
		if (!diagnostic.file || ignoreDiagnostic(diagnostic, expectedErrors)) {
			continue;
		}

		const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start as number);

		diagnostics.push({
			fileName: diagnostic.file.fileName,
			message: flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
			severity: 'error',
			line: position.line + 1,
			column: position.character
		});
	}

	for (const [, diagnostic] of expectedErrors) {
		diagnostics.push({
			...diagnostic,
			message: 'Expected an error, but found none.',
			severity: 'error'
		});
	}

	return {numTests, diagnostics};
};
