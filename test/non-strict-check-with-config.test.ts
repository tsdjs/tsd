import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('pass in loose mode when strict mode is disabled in settings', async () => {
	const diagnostics = await tsd({
		cwd: path.join(FIXTURES_PATH, 'non-strict-check-with-config')
	});

	verify(diagnostics, []);
});
