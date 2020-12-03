import * as path from 'path';
import {
	flattenDiagnosticMessageText,
	createProgram,
	Diagnostic as TSDiagnostic,
	SourceFile
} from '../../libraries/typescript';
import {extractAssertions, parseErrorAssertionToLocation} from './parser';
import {Diagnostic, DiagnosticCode, Context, Location} from './interfaces';
import {handle} from './assertions';

// List of diagnostic codes that should be ignored in general
const ignoredDiagnostics = new Set<number>([
	DiagnosticCode.TopLevelAwaitOnlyAllowedWhenModuleESNextOrSystem
]);

// List of diagnostic codes which should be ignored inside `expectError` statements
const expectErrordiagnosticCodesToIgnore = new Set<DiagnosticCode>([
	DiagnosticCode.ArgumentTypeIsNotAssignableToParameterType,
	DiagnosticCode.PropertyDoesNotExistOnType,
	DiagnosticCode.CannotAssignToReadOnlyProperty,
	DiagnosticCode.TypeIsNotAssignableToOtherType,
	DiagnosticCode.TypeDoesNotSatisfyTheConstraint,
	DiagnosticCode.GenericTypeRequiresTypeArguments,
	DiagnosticCode.ExpectedArgumentsButGotOther,
	DiagnosticCode.NoOverloadMatches,
	DiagnosticCode.PropertyMissingInType1ButRequiredInType2
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

	if (!expectErrordiagnosticCodesToIgnore.has(diagnostic.code)) {
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

	const diagnostics: Diagnostic[] = [];

	const program = createProgram(fileNames, context.config.compilerOptions);

	const tsDiagnostics = program
		.getSemanticDiagnostics()
		.concat(program.getSyntacticDiagnostics());

	const assertions = extractAssertions(program);

	diagnostics.push(...handle(program.getTypeChecker(), assertions));

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

	return diagnostics;
};
