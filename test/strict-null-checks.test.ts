import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verifyWithFileName} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('fail if tests don\'t pass in strict mode', async () => {
	const cwd = path.join(FIXTURES_PATH, 'failure-strict-null-checks');
	const diagnostics = await tsd({cwd});

	verifyWithFileName(cwd, diagnostics, [
		[
			4,
			19,
			'error',
			'Argument of type \'number | null\' is not assignable to parameter of type \'number\'.\n  Type \'null\' is not assignable to type \'number\'.',
			'index.test-d.ts',
		],
	]);
});

test.concurrent('overridden config defaults to `strict` if `strict` is not explicitly overridden', async () => {
	const cwd = path.join(FIXTURES_PATH, 'strict-null-checks-as-default-config-value');
	const diagnostics = await tsd({cwd});

	verifyWithFileName(cwd, diagnostics, [
		[
			4,
			19,
			'error',
			'Argument of type \'number | null\' is not assignable to parameter of type \'number\'.\n  Type \'null\' is not assignable to type \'number\'.',
			'index.test-d.ts',
		],
	]);
});
