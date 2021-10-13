import path from 'path';
import {ExecutionContext} from 'ava';
import {ExtendedDiagnostic} from '../../lib/interfaces';

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

/**
 * Verify a list of diagnostics.
 *
 * @param t - The AVA execution context.
 * @param extendedDiagnostics - Object containing list of TypeScript diagnostics and test count.
 * @param expectations - Expected diagnostics.
 */
export const verify = (
	t: ExecutionContext,
	{diagnostics}: ExtendedDiagnostic,
	expectations: Expectation[]
) => {
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
 * @param extendedDiagnostics - Object containing list of TypeScript diagnostics and test count.
 * @param expectations - Expected diagnostics.
 */
export const verifyWithFileName = (
	t: ExecutionContext,
	cwd: string,
	{diagnostics}: ExtendedDiagnostic,
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
