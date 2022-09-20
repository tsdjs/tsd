import path from 'path';
import {ExecutionContext} from 'ava';
import {Diagnostic} from '../../lib/interfaces';

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
	}
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
	expectations: ExpectationWithFileName[]
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
	expectations: ExpectationWithDiff[]
) => {
	const diagnosticObjs = diagnostics.map(({line, column, severity, message, diff}) => ({
		line,
		column,
		severity,
		message,
		diff
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
