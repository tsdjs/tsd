import {
	flattenDiagnosticMessageText,
	createProgram,
	Program,
	Diagnostic as TSDiagnostic
} from '@tsd/typescript';
import {ExpectedError, extractAssertions, parseErrorAssertionToLocation} from './parser';
import {Diagnostic, DiagnosticCode, Context, Location} from './interfaces';
import {handle} from './assertions';
import {createTsProgram} from './utils/typescript';

// List of diagnostic codes that should be ignored in general
const ignoredDiagnostics = new Set<number>([
	// Older TS version report 'await expression only allowed within async function
	DiagnosticCode.AwaitExpressionOnlyAllowedWithinAsyncFunction,
	DiagnosticCode.TopLevelAwaitOnlyAllowedWhenModuleESNextOrSystem
]);

// List of diagnostic codes which should be ignored inside `expectError` statements
const expectErrorDiagnosticCodesToIgnore = new Set<DiagnosticCode>([
	DiagnosticCode.ArgumentTypeIsNotAssignableToParameterType,
	DiagnosticCode.PropertyDoesNotExistOnType,
	DiagnosticCode.CannotAssignToReadOnlyProperty,
	DiagnosticCode.TypeIsNotAssignableToOtherType,
	DiagnosticCode.TypeDoesNotSatisfyTheConstraint,
	DiagnosticCode.GenericTypeRequiresTypeArguments,
	DiagnosticCode.GenericTypeRequiresBetweenXAndYTypeArugments,
	DiagnosticCode.ExpectedArgumentsButGotOther,
	DiagnosticCode.ExpectedAtLeastArgumentsButGotOther,
	DiagnosticCode.NoOverloadExpectsCountOfArguments,
	DiagnosticCode.NoOverloadExpectsCountOfTypeArguments,
	DiagnosticCode.NoOverloadMatches,
	DiagnosticCode.PropertyMissingInType1ButRequiredInType2,
	DiagnosticCode.TypeHasNoPropertiesInCommonWith,
	DiagnosticCode.ThisContextOfTypeNotAssignableToMethodOfThisType,
	DiagnosticCode.ValueOfTypeNotCallable,
	DiagnosticCode.ExpressionNotCallable,
	DiagnosticCode.TypeNotAssignableWithExactOptionalPropertyTypes,
	DiagnosticCode.TypeNotAssignableToParameterWithExactOptionalPropertyTypes,
	DiagnosticCode.TypeNotAssignableTypeOfTargetWithExactOptionalPropertyTypes,
	DiagnosticCode.IndexSignatureOnlyPermitsReading,
	DiagnosticCode.OnlyVoidFunctionIsNewCallable,
	DiagnosticCode.ExpressionNotConstructable,
	DiagnosticCode.NewExpressionTargetLackingConstructSignatureHasAnyType,
	DiagnosticCode.MemberCannotHaveOverrideModifierBecauseItIsNotDeclaredInBaseClass,
	DiagnosticCode.MemberMustHaveOverrideModifier,
	DiagnosticCode.StringLiteralTypeIsNotAssignableToUnionTypeWithSuggestion,
]);

type IgnoreDiagnosticResult = 'preserve' | 'ignore' | Location;

/**
 * Check if the provided diagnostic should be ignored.
 *
 * @param diagnostic - The diagnostic to validate.
 * @param expectedErrors - Map of the expected errors.
 * @returns Whether the diagnostic should be `'preserve'`d, `'ignore'`d or, in case that
 * the diagnostic is reported from inside of an `expectError` assertion, the `Location`
 * of the assertion.
 */
const ignoreDiagnostic = (
	diagnostic: TSDiagnostic,
	expectedErrors: Map<Location, ExpectedError>
): IgnoreDiagnosticResult => {
	if (ignoredDiagnostics.has(diagnostic.code)) {
		// Filter out diagnostics which are present in the `ignoredDiagnostics` set
		return 'ignore';
	}

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const diagnosticFileName = diagnostic.file!.fileName;

	for (const [location, error] of expectedErrors) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const start = diagnostic.start!;

		// Diagnostic is inside of `expectError` clause
		if (diagnosticFileName === location.fileName && start > location.start && start < location.end) {
			// Ignore syntactical errors
			if (diagnostic.code < 2000) {
				expectedErrors.delete(location);
				return 'preserve';
			}

			// Set diagnostic code on `ExpectedError` to log
			if (!expectErrorDiagnosticCodesToIgnore.has(diagnostic.code)) {
				error.code = diagnostic.code;
				return 'preserve';
			}

			return location;
		}
	}

	return 'preserve';
};

/**
 * Get a list of TypeScript diagnostics for a given program.
 *
 * @param program - A TypeScript program.
 * @returns List of diagnostics
 */
const getDiagnostics = (program: Program): Diagnostic[] => {
	const diagnostics: Diagnostic[] = [];

	const tsDiagnostics = program
		.getSemanticDiagnostics()
		.concat(program.getSyntacticDiagnostics());

	const assertions = extractAssertions(program);

	diagnostics.push(...handle(program.getTypeChecker(), assertions));

	const expectedErrors = parseErrorAssertionToLocation(assertions);
	const expectedErrorsLocationsWithFoundDiagnostics: Location[] = [];

	for (const diagnostic of tsDiagnostics) {
		/* Filter out all diagnostic messages without a file or from node_modules directories, files under
		 * node_modules are most definitely not under test.
		 */
		if (!diagnostic.file || /[/\\]node_modules[/\\]/.test(diagnostic.file.fileName)) {
			continue;
		}

		const ignoreDiagnosticResult = ignoreDiagnostic(diagnostic, expectedErrors);

		if (ignoreDiagnosticResult !== 'preserve') {
			if (ignoreDiagnosticResult !== 'ignore') {
				expectedErrorsLocationsWithFoundDiagnostics.push(ignoreDiagnosticResult);
			}

			continue;
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);

		diagnostics.push({
			fileName: diagnostic.file.fileName,
			message: flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
			severity: 'error',
			line: position.line + 1,
			column: position.character
		});
	}

	for (const errorLocationToRemove of expectedErrorsLocationsWithFoundDiagnostics) {
		expectedErrors.delete(errorLocationToRemove);
	}

	for (const [, diagnostic] of expectedErrors) {
		const message = diagnostic.code ?
			`Found an error that tsd does not currently support (\`ts${diagnostic.code}\`), consider creating an issue on GitHub.` :
			'Expected an error, but found none.';

		diagnostics.push({
			...diagnostic,
			message,
			severity: 'error'
		});
	}

	return diagnostics;
};

/**
 * Get a list of TypeScript diagnostics within the current context.
 *
 * @param context - The context object.
 * @returns List of diagnostics
 */
export const getAllDiagnostics = (context: Context): Diagnostic[] => {
	const globProgram = createProgram(context.testFiles.globs, context.config.compilerOptions);
	const globDiagnostics = getDiagnostics(globProgram);

	if (context.testFiles.sourceFiles === undefined) {
		return globDiagnostics;
	}

	const customProgram = createTsProgram(context.testFiles.sourceFiles, context.config.compilerOptions);

	return [
		...globDiagnostics,
		...getDiagnostics(customProgram),
	];
};
