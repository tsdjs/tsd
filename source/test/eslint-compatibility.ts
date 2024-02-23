import path from 'node:path';
import test from 'ava';
import {execa} from 'execa';
import {stripIndent} from 'common-tags';

test('`expectType` is compatible with eslint @typescript-eslint/no-unsafe-call rule', async t => {
	await t.throwsAsync(
		execa('eslint', ['source/test/fixtures/eslint-compatibility', '--no-ignore']),
		{
			message: stripIndent`
				${path.resolve('fixtures/eslint-compatibility')}/index.test-d.ts
				9:1  error  Unsafe call of an \`any\` typed value  @typescript-eslint/no-unsafe-call

				✖ 1 problem (1 error, 0 warnings)
			`,
		},
		'eslint should have found an error!',
	);
});
