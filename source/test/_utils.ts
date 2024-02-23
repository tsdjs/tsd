import process from 'node:process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test, {type ExecutionContext} from 'ava';
import {
	type ExecaError, execa, execaNode, execaCommand,
} from 'execa';
import tsd, {type Options} from '../lib/index.js';
import type {Diagnostic} from '../lib/interfaces.js';

// TODO: switch to URL when execa is updated
export const binPath = fileURLToPath(new URL('../cli.ts', import.meta.url));

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

export const getFixture = (fixtureName: string) => fixtureName.length > 0
	? fileURLToPath(new URL(`fixtures/${fixtureName}`, import.meta.url))
	: process.cwd();

type VerifyType = 'verify' | 'verifyWithFileName' | 'verifyWithDiff';

type ExpectationType<Type extends VerifyType> = (
	Type extends 'verify'
		? Expectation[]
		: Type extends 'verifyWithFileName'
			? ExpectationWithFileName[]
			: ExpectationWithDiff[]
);

type VerifyTsdOptions = {
	fixtureName: string;
	tsdOptions?: Omit<Options, 'cwd'>;
};

type FixtureName = string;

const parseOptions = (options: FixtureName | VerifyTsdOptions) => {
	const [fixtureName, tsdOptions] = typeof options === 'string'
		? [options, {}]
		: [options.fixtureName, options.tsdOptions ?? {}];

	const cwd = getFixture(fixtureName);

	return {cwd, tsdOptions};
};

const _verifyTsd = <Type extends VerifyType>(verifyType: Type) => (
	test.macro(async (t, options: FixtureName | VerifyTsdOptions, expectations: ExpectationType<Type>) => {
		const {cwd, tsdOptions} = parseOptions(options);
		const diagnostics = await tsd({cwd, ...tsdOptions});

		const assertions = await t.try(tt => {
			tt.log('cwd:', cwd);

			switch (verifyType) {
				case 'verify': {
					verify(tt, diagnostics, expectations as ExpectationType<'verify'>);
					break;
				}

				case 'verifyWithFileName': {
					verifyWithFileName(tt, cwd, diagnostics, expectations as ExpectationType<'verifyWithFileName'>);
					break;
				}

				case 'verifyWithDiff': {
					verifyWithDiff(tt, diagnostics, expectations as ExpectationType<'verifyWithDiff'>);
					break;
				}

				default: {
					break;
				}
			}
		});

		assertions.commit({retainLogs: !assertions.passed});
	})
);

export const verifyTsd = _verifyTsd('verify');
export const verifyTsdWithFileNames = _verifyTsd('verifyWithFileName');
export const verifyTsdWithDiff = _verifyTsd('verifyWithDiff');

export const noDiagnostics = test.macro(async (t, fixtureName: string) => {
	const cwd = getFixture(fixtureName);
	const diagnostics = await tsd({cwd});

	const assertions = await t.try(tt => {
		tt.log('cwd:', cwd);
		verify(tt, diagnostics, []);
	});

	assertions.commit({retainLogs: !assertions.passed});
});

// TODO: maybe use TsdError in generic
export const verifyTsdFails = test.macro(async (t, options: FixtureName | VerifyTsdOptions, message: (cwd: string) => string) => {
	const {cwd, tsdOptions} = parseOptions(options);
	await t.throwsAsync(tsd({cwd, ...tsdOptions}), {message: message(cwd)});
});

const _verifyCli = (shouldPass: boolean) => (
	test.macro(async (t, fixtureName: string, arguments_: string[], expectations: string[] | ((cwd: string) => string[]), options?: VerifyCliOptions) => {
		const cwd = getFixture(fixtureName);

		const assertions = await t.try(async tt => {
			tt.log('cwd:', cwd);

			const result = shouldPass
				? await execa(binPath, arguments_, {cwd})
				: await tt.throwsAsync<ExecaError>(execa(binPath, arguments_, {cwd, preferLocal: true}));

			tt.log(result);

			const expectedLines = typeof expectations === 'function'
				? expectations(cwd)
				: expectations;

			verifyCli(tt, result.stdout ?? result.stderr ?? '', expectedLines, options);
			tt.is(result?.exitCode, shouldPass ? 0 : 1, 'CLI exited with the wrong exit code!');
		});

		assertions.commit({retainLogs: !assertions.passed});
	})
);

export const verifyCliPasses = _verifyCli(true);
export const verifyCliFails = _verifyCli(false);
