import path from 'node:path';
import test, {type ExecutionContext} from 'ava';
import {type ExecaError, execa} from 'execa';
import tsd from '../index.js';
import type {Diagnostic} from '../lib/interfaces.js';

export const binPath = path.resolve('../cli.js');

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

type VerifyCliOptions = {
	startLine: number;
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
	{startLine}: VerifyCliOptions = {startLine: 1}, // Skip file location.
) => {
	const receivedLines = diagnostics.trim().split('\n').slice(startLine).map(line => line.trim());

	t.deepEqual(receivedLines, expectedLines, 'Received diagnostics that are different from expectations!');
};

export const getFixture = (fixtureName: string) => path.resolve('fixtures', fixtureName);

type VerifyType = 'verify' | 'verifyWithFileName' | 'verifyWithDiff';

type ExpectationType<Type extends VerifyType> = (
	Type extends 'verify'
		? Expectation[]
		: Type extends 'verifyWithFileName'
			? ExpectationWithFileName[]
			: ExpectationWithDiff[]
);

const _verifyTsd = <Type extends VerifyType>(verifyType: Type) => (
	test.macro(async (t, fixtureName: string, expectations: ExpectationType<Type>) => {
		const cwd = getFixture(fixtureName);
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

			default: {
				break;
			}
		}
	})
);

export const verifyTsd = _verifyTsd('verify');
export const verifyTsdWithFileNames = _verifyTsd('verifyWithFileName');
export const verifyTsdWithDiff = _verifyTsd('verifyWithDiff');

export const noDiagnostics = test.macro(async (t, fixtureName: string) => {
	const cwd = path.resolve('fixtures', fixtureName);
	const diagnostics = await tsd({cwd});

	verify(t, diagnostics, []);
});

const _verifyCli = (shouldPass: boolean) => test.macro(async (t, fixtureName: string, args: string[], expectedLines: string[], options?: VerifyCliOptions) => {
	const cwd = getFixture(fixtureName);
	const result = shouldPass
		? await execa(binPath, args, {cwd})
		: await t.throwsAsync<ExecaError>(execa(binPath, args, {cwd}));

	verifyCli(t, result?.stdout ?? result?.stderr ?? '', expectedLines, options);
	t.is(result?.exitCode, shouldPass ? 0 : 1, 'CLI exited with the wrong exit code!');
});

export const verifyCliPasses = _verifyCli(true);
export const verifyCliFails = _verifyCli(false);
