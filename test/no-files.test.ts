import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verifyWithFileName} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('fail if typings file is not part of `files` list', async () => {
	const cwd = path.join(FIXTURES_PATH, 'no-files');
	const diagnostics = await tsd({cwd});

	verifyWithFileName(cwd, diagnostics, [
		[3, 1, 'error', 'TypeScript type definition `index.d.ts` is not part of the `files` list.', 'package.json'],
	]);
});
