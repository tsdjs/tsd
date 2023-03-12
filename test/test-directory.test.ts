import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('support default test directory', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'test-directory/default')});
	verify(diagnostics, []);
});

test.concurrent('support tsx in subdirectory', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'test-directory/tsx')});
	verify(diagnostics, []);
});

test.concurrent('support setting a custom test directory', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'test-directory/custom')});
	verify(diagnostics, [
		[4, 0, 'error', 'Expected an error, but found none.']
	]);
});
