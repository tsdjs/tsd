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
	t.true(diagnostics.length === expectations.length);

	for (const [index, diagnostic] of diagnostics.entries()) {
		t.is(diagnostic.line, expectations[index][0]);
		t.is(diagnostic.column, expectations[index][1]);
		t.is(diagnostic.severity, expectations[index][2]);
		t.is(diagnostic.message, expectations[index][3]);

		const filename = expectations[index][4];

		if (typeof filename === 'string') {
			t.is(diagnostic.fileName, filename);
		} else if (typeof filename === 'object') {
			t.regex(diagnostic.fileName, filename);
		}
	}
};
