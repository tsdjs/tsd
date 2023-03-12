import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('add support for esm with esModuleInterop', async () => {
	const diagnostics = await tsd({
		cwd: path.join(FIXTURES_PATH, 'esm')
	});
	verify(diagnostics, []);
});
