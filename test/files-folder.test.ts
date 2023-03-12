import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('allow specifying folders containing typings file in `files` list', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'files-folder')});

	verify(diagnostics, []);
});
