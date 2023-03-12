import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('allow omitting `types` property when `main` property is missing but main is a barrel (`index.js`) and .d.ts file matches main', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'no-explicit-types-property/without-main')});

	verify(diagnostics, [
		[6, 0, 'error', 'Expected an error, but found none.']
	]);
});

test.concurrent('allow omitting `types` property when `main` property is set to a barrel (`index.js`) and .d.ts file matches main', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'no-explicit-types-property/with-main-barrel')});

	verify(diagnostics, [
		[6, 0, 'error', 'Expected an error, but found none.']
	]);
});

test.concurrent('allow omitting `types` property when `main` property is set to non-barrel (`foo.js`) and .d.ts file matches main', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'no-explicit-types-property/with-main-other')});

	verify(diagnostics, [
		[6, 0, 'error', 'Expected an error, but found none.']
	]);
});
