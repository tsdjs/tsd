import {
	flattenDiagnosticMessageText,
	createProgram,
	Diagnostic as TSDiagnostic
} from '@tsd/typescript';
import {ExpectedError, extractAssertions, parseErrorAssertionToLocation} from './parser';
import {Diagnostic, DiagnosticCode, Context, Location} from './interfaces';
import {handle} from './assertions/tsd';
import {JestLikeContext, JestLikeErrorLocation, JestLikeExpectedError, jestLikeHandle} from './assertions/jest-like';
import {makeDiagnostic} from './utils';

// List of diagnostic codes that should be ignored in general
const ignoredDiagnostics = new Set<number>([
	// Older TS version report 'await expression only allowed within async function
	DiagnosticCode.AwaitExpressionOnlyAllowedWithinAsyncFunction,
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

	if (!expectErrordiagnosticCodesToIgnore.has(diagnostic.code)) {
		return 'preserve';
	}

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const diagnosticFileName = diagnostic.file!.fileName;

	for (const [location] of expectedErrors) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const start = diagnostic.start!;

		if (diagnosticFileName === location.fileName && start > location.start && start < location.end) {
			return location;
		}
	}

	return 'preserve';
};

/**
 * Get a list of TypeScript diagnostics within the current context.
 *
 * @param context - The context object.
 * @returns List of diagnostics
 */
export const getDiagnostics = (context: Context): Diagnostic[] => {
	const diagnostics: Diagnostic[] = [];

	const program = createProgram(context.testFiles, context.config.compilerOptions);

	const tsDiagnostics = program
		.getSemanticDiagnostics()
		.concat(program.getSyntacticDiagnostics());

	const assertions = extractAssertions(program);
	const typeChecker = program.getTypeChecker();

	const jestLikeContext: JestLikeContext = {
		typeChecker,
		expectedErrors: new Map(),
		assertions: assertions.jestLikeAssertions
	};

	diagnostics.push(...assertions.diagnostics);
	diagnostics.push(...jestLikeHandle(jestLikeContext));
	diagnostics.push(...handle(typeChecker, assertions.assertions));

	const expectedErrors = parseErrorAssertionToLocation(assertions.assertions);
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

		const {fileName} = diagnostic.file;
		const start = Number(diagnostic.start);
		const position = diagnostic.file.getLineAndCharacterOfPosition(start);
		const jestLikeError = findJestLikeErrorAtPosition(jestLikeContext.expectedErrors, start);

		const pushDiagnostic = (message: string) => diagnostics.push({
			message,
			fileName,
			severity: 'error',
			line: position.line + 1,
			column: position.character
		});

		if (jestLikeError) {
			const [location, error] = jestLikeError;
			const message = flattenDiagnosticMessageText(diagnostic.messageText, '\n');

			jestLikeContext.expectedErrors.delete(location);

			if (error.code && error.code !== diagnostic.code) {
				pushDiagnostic(`Expected error with code '${error.code}' but received error with code '${diagnostic.code}'.`);
			} else if (error.message && !message.includes(error.message)) {
				pushDiagnostic(`Expected error message to includes '${error.message}' but received error with message '${message}'.`);
			} else if (error.regexp && !error.regexp.test(message)) {
				pushDiagnostic(`Expected error message to match '${error.regexp.source}' but received error with message '${message}'.`);
			}

			continue;
		}

		pushDiagnostic(flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
	}

	for (const errorLocationToRemove of expectedErrorsLocationsWithFoundDiagnostics) {
		expectedErrors.delete(errorLocationToRemove);
	}

	for (const [, diagnostic] of expectedErrors) {
		diagnostics.push({
			...diagnostic,
			message: 'Expected an error, but found none.',
			severity: 'error'
		});
	}

	for (const [, error] of jestLikeContext.expectedErrors) {
		diagnostics.push(makeDiagnostic(error.node, 'Expected an error, but found none.'));
	}

	return diagnostics;
};

function findJestLikeErrorAtPosition(expectedErrors: JestLikeContext['expectedErrors'], start: number): [JestLikeErrorLocation, JestLikeExpectedError] | undefined {
	for (const [location, error] of expectedErrors) {
		if (location.start <= start && start <= location.end) {
			return [location, error];
		}
	}

	return undefined;
}
