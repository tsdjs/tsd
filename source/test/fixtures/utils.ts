import {ExecutionContext} from 'ava';
import {Diagnostic} from '../../lib/interfaces';

type Expectation = [number, number, 'error' | 'warning', string, (string | RegExp)?];

/**
 * Verify a list of diagnostics.
 *
 * @param t - The AVA execution context.
 * @param diagnostics - List of diagnostics to verify.
 * @param expectations - Expected diagnostics.
 */
export const verify = (t: ExecutionContext, diagnostics: Diagnostic[], expectations: Expectation[]) => {
	t.deepEqual(diagnostics.length, expectations.length, 'Received different count of diagnostics than expected!');

	for (const [index, diagnostic] of diagnostics.entries()) {
		t.is(diagnostic.line, expectations[index][0], `"line" for diagnostic ${index} doesn't match!`);
		t.is(diagnostic.column, expectations[index][1], `"column" for diagnostic ${index} doesn't match!`);
		t.is(diagnostic.severity, expectations[index][2], `"severity" for diagnostic ${index} doesn't match!`);
		t.is(diagnostic.message, expectations[index][3], `"message" for diagnostic ${index} doesn't match!`);

		const filename = expectations[index][4];

		if (typeof filename === 'string') {
			t.is(diagnostic.fileName, filename, `"fileName" for diagnostic ${index} doesn't match!`);
		} else if (typeof filename === 'object') {
			t.regex(diagnostic.fileName, filename, `"fileName" for diagnostic ${index} doesn't match!`);
		}
	}
};
