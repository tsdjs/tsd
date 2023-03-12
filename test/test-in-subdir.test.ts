import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('support testing in sub-directories', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'test-in-subdir')});

	verify(diagnostics, []);
});
