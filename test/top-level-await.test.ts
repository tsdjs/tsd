import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('support top-level await', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'top-level-await')});

	verify(diagnostics, []);
});
