import path from 'path';
import { expect } from 'vitest';
import {Diagnostic} from '../../source/lib/interfaces';

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
 * @param diagnostics - List of diagnostics to verify.
 * @param expectations - Expected diagnostics.
 */
export const verify = (diagnostics: Diagnostic[], expectations: Expectation[]) => {
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

	expect(diagnosticObjs).toStrictEqual(expectationObjs);
};

/**
 * Verify a list of diagnostics including file paths.
 *
 * @param cwd - The working directory as passed to `tsd`.
 * @param diagnostics - List of diagnostics to verify.
 * @param expectations - Expected diagnostics.
 */
export const verifyWithFileName = (
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

	expect(diagnosticObjs).toStrictEqual(expectationObjs);
};
