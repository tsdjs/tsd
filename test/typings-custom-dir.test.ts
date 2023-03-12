import path from 'path';
import {expect, test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import tsd from '../dist';
import {throwsAsync} from './fixtures/throws-async';

test.concurrent('typings in custom directory', async () => {
	const diagnostics = await tsd({
		cwd: path.join(FIXTURES_PATH, 'typings-custom-dir'),
		typingsFile: 'utils/index.d.ts'
	});

	verify(diagnostics, [
		[5, 19, 'error', 'Argument of type \'number\' is not assignable to parameter of type \'string\'.']
	]);
});

test.concurrent('fails if typings file is not found in the specified path', async () => {
	const cwd = path.join(FIXTURES_PATH, 'typings-custom-dir');
	const error = await throwsAsync(tsd({
		cwd,
		typingsFile: 'unknown.d.ts'
	}));
	expect(error.message).toMatch(`The type definition \`unknown.d.ts\` does not exist at \`${path.join(cwd, 'unknown.d.ts')}\`. Is the path correct? Create one and try again.`);
});
