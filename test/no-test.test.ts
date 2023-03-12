import path from 'path';
import {expect, test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {throwsAsync} from './fixtures/throws-async';
import tsd from '../dist';

test.concurrent('throw if no test is found', async () => {
	const cwd = path.join(FIXTURES_PATH, 'no-test');
	const error = await throwsAsync<Error>(tsd({cwd}));

	expect(error.message).toMatch(`The test file \`index.test-d.ts\` or \`index.test-d.tsx\` does not exist in \`${cwd}\`. Create one and try again.`);
});
