import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('missing import', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'missing-import')});

	verify(diagnostics, [
		[3, 18, 'error', 'Cannot find name \'Primitive\'.']
	]);
});
