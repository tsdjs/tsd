import path from 'node:path';
import test, {type ExecutionContext} from 'ava';
import tsd from '../index.js';
import type {Diagnostic} from '../lib/interfaces.js';

type Expectation = [
	line: number,
	column: number,
	severity: 'error' | 'warning',
	message: string,
];

type ExpectationWithFileName = [
	line: number,
	column: number,
	severity: 'error' | 'warning',
	message: string,
	fileName: string,
];

type ExpectationWithDiff = [
	line: number,
	column: number,
	severity: 'error' | 'warning',
	message: string,
	diff: {
		expected: string;
		received: string;
	},
];

/**
 * Verify a list of diagnostics.
 *
 * @param t - The AVA execution context.
 * @param diagnostics - List of diagnostics to verify.
 * @param expectations - Expected diagnostics.
 */
export const verify = (t: ExecutionContext, diagnostics: Diagnostic[], expectations: Expectation[]) => {
	const diagnosticObjs = diagnostics.map(({line, column, severity, message}) => ({
		line,
		column,
		severity,
		message,
	}));

	const expectationObjs = expectations.map(([line, column, severity, message]) => ({
		line,
		column,
		severity,
		message,
	}));

	t.deepEqual(diagnosticObjs, expectationObjs, 'Received diagnostics that are different from expectations!');
};

/**
 * Verify a list of diagnostics including file paths.
 *
 * @param t - The AVA execution context.
 * @param cwd - The working directory as passed to `tsd`.
 * @param diagnostics - List of diagnostics to verify.
 * @param expectations - Expected diagnostics.
 */
export const verifyWithFileName = (
	t: ExecutionContext,
	cwd: string,
	diagnostics: Diagnostic[],
	expectations: ExpectationWithFileName[],
) => {
	const diagnosticObjs = diagnostics.map(({line, column, severity, message, fileName}) => ({
		line,
		column,
		severity,
		message,
		fileName: path.relative(cwd, fileName),
	}));

	const expectationObjs = expectations.map(([line, column, severity, message, fileName]) => ({
		line,
		column,
		severity,
		message,
		fileName,
	}));

	t.deepEqual(diagnosticObjs, expectationObjs, 'Received diagnostics that are different from expectations!');
};

/**
 * Verify a list of diagnostics including diff.
 *
 * @param t - The AVA execution context.
 * @param cwd - The working directory as passed to `tsd`.
 * @param diagnostics - List of diagnostics to verify.
 * @param expectations - Expected diagnostics.
 */
export const verifyWithDiff = (
	t: ExecutionContext,
	diagnostics: Diagnostic[],
	expectations: ExpectationWithDiff[],
) => {
	const diagnosticObjs = diagnostics.map(({line, column, severity, message, diff}) => ({
		line,
		column,
		severity,
		message,
		diff,
	}));

	const expectationObjs = expectations.map(([line, column, severity, message, diff]) => ({
		line,
		column,
		severity,
		message,
		diff,
	}));

	t.deepEqual(diagnosticObjs, expectationObjs, 'Received diagnostics that are different from expectations!');
};

/**
 * Verify a list of diagnostics reported from the CLI.
 *
 * @param t - The AVA execution context.
 * @param diagnostics - List of diagnostics to verify.
 * @param expectations - Expected diagnostics.
 * @param startLine - Optionally specify how many lines to skip from start.
 */
export const verifyCli = (
	t: ExecutionContext,
	diagnostics: string,
	expectedLines: string[],
	// eslint-disable-next-line unicorn/no-object-as-default-parameter
	{startLine}: {startLine: number} = {startLine: 1}, // Skip file location.
) => {
	const receivedLines = diagnostics.trim().split('\n').slice(startLine).map(line => line.trim());

	t.deepEqual(receivedLines, expectedLines, 'Received diagnostics that are different from expectations!');
};

type VerifyType = 'verify' | 'verifyWithFileName' | 'verifyWithDiff' | 'verifyCli';

type ExpectationType<Type extends VerifyType> = (
	Type extends 'verify'
		? Expectation[]
		: Type extends 'verifyWithFileName'
			? ExpectationWithFileName[]
			: Type extends 'verifyWithDiff'
				? ExpectationWithDiff[]
				: string[]
);

const _verifyTsd = <Type extends VerifyType>(verifyType: Type) => (
	test.macro(async (t, fixtureName: string, expectations: ExpectationType<Type>) => {
		const cwd = path.resolve('fixtures', fixtureName);
		const diagnostics = await tsd({cwd});

		switch (verifyType) {
			case 'verify': {
				verify(t, diagnostics, expectations as ExpectationType<'verify'>);
				break;
			}

			case 'verifyWithFileName': {
				verifyWithFileName(t, cwd, diagnostics, expectations as ExpectationType<'verifyWithFileName'>);
				break;
			}

			case 'verifyWithDiff': {
				verifyWithDiff(t, diagnostics, expectations as ExpectationType<'verifyWithDiff'>);
				break;
			}

			// Case 'verifyCli': {
			// 	verifyCli(t, diagnostics, expectations as ExpectationType<'verifyCli'>);
			// 	break;
			// }
			default: {
				break;
			}
		}
	})
);

export const verifyTsd = _verifyTsd('verify');
export const verifyTsdWithFileNames = _verifyTsd('verifyWithFileName');
export const verifyTsdWithDiff = _verifyTsd('verifyWithDiff');
// Export const verifyCli = _verifyTsd('verifyCli');

export const noDiagnostics = test.macro(async (t, fixtureName: string) => {
	const cwd = path.resolve('fixtures', fixtureName);
	const diagnostics = await tsd({cwd});

	verify(t, diagnostics, []);
});
