import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('return diagnostics', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'failure')});

	verify(diagnostics, [
		[5, 19, 'error', 'Argument of type \'number\' is not assignable to parameter of type \'string\'.']
	]);
});

test.concurrent('return no diagnostics', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'success')});

	verify(diagnostics, []);
});
