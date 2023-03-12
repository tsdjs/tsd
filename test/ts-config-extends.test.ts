import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('includes extended config files along with found ones', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'ts-config-extends')});

	verify(diagnostics, [
		[6, 64, 'error', 'Not all code paths return a value.'],
	]);
});
