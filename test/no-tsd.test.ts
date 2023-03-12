import path from 'path';
import {expect, test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {throwsAsync} from './fixtures/throws-async';
import tsd from '../dist';

test.concurrent('throw if no type definition was found', async () => {
	const cwd = path.join(FIXTURES_PATH, 'no-tsd');
	const index = path.join(cwd, 'index.d.ts');
	const error = await throwsAsync<Error>(tsd({cwd}));

	expect(error.message).toMatch(`The type definition \`index.d.ts\` does not exist at \`${index}\`. Is the path correct? Create one and try again.`);
});
