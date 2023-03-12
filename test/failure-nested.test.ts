import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verifyWithFileName} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('return diagnostics from imported files as well', async () => {
	const cwd = path.join(FIXTURES_PATH, 'failure-nested');
	const diagnostics = await tsd({cwd});

	verifyWithFileName(cwd, diagnostics, [
		[5, 19, 'error', 'Argument of type \'number\' is not assignable to parameter of type \'string\'.', 'child.test-d.ts'],
		[6, 19, 'error', 'Argument of type \'number\' is not assignable to parameter of type \'string\'.', 'index.test-d.ts'],
	]);
});
