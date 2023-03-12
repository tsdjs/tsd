import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('allow specifying negative gitignore-style patterns in `files` list', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'files-gitignore-patterns/negative-pattern')});

	verify(diagnostics, [
		[3, 1, 'error', 'TypeScript type definition `index.d.ts` is not part of the `files` list.'],
	]);
});

test.concurrent('allow specifying negated negative (positive) gitignore-style patterns in `files` list', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'files-gitignore-patterns/negative-pattern-negated')});

	verify(diagnostics, []);
});

test.concurrent('allow specifying root marker (/) gitignore-style patterns in `files` list', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'files-gitignore-patterns/root-marker-pattern')});

	verify(diagnostics, []);
});
