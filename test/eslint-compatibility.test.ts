import path from 'path';
import {expect, test} from 'vitest';
import execa, {type ExecaError} from 'execa';
import {throwsAsync} from './fixtures/throws-async';
import {FIXTURES_PATH, NODE_MODULES_PATH} from './fixtures/constants';

test('`expectType` is compatible with eslint @typescript-eslint/no-unsafe-call rule', async () => {
	const cwd = path.join(FIXTURES_PATH, 'eslint-compatibility');

	const {exitCode, stdout} = await throwsAsync<ExecaError>(execa(path.join(NODE_MODULES_PATH, '.bin/eslint'), [cwd], {cwd}));

	expect(exitCode).toBe(1);

	const outLines = stdout.trim().split('\n');

	expect(outLines[0]).toMatch(/fixtures[/\\]eslint-compatibility[/\\]index.test-d.ts$/);
	expect(outLines[1]).toMatch('9:1  error  Unsafe call of an `any` typed value  @typescript-eslint/no-unsafe-call');
	expect(outLines[3]).toMatch('✖ 1 problem (1 error, 0 warnings)');
});
