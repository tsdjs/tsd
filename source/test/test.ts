import * as path from 'path';
import test from 'ava';
import m from '../lib';

test('throw if no type definition was found', async t => {
	await t.throws(m({cwd: path.join(__dirname, 'fixtures/no-tsd')}), 'The type definition `index.d.ts` does not exist. Create one and try again.');
});

test('throw if no test is found', async t => {
	await t.throws(m({cwd: path.join(__dirname, 'fixtures/no-test')}), 'The test file `index.test-d.ts` does not exist. Create one and try again.');
});

test('return diagnostics', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/failure')});

	t.true(diagnostics.length === 1);
	t.is(diagnostics[0].message, 'Argument of type \'number\' is not assignable to parameter of type \'string\'.');
});

test('fail if typings file is not part of `files` list', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/no-files')});

	t.deepEqual(diagnostics, [
		{
			fileName: 'package.json',
			message: 'TypeScript type definition `index.d.ts` is not part of the `files` list.',
			severity: 'error',
			line: 3,
			column: 1
		}
	]);
});

test('return no diagnostics', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/success')});

	t.true(diagnostics.length === 0);
});

test('support top-level await', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/top-level-await')});

	t.true(diagnostics.length === 0);
});
