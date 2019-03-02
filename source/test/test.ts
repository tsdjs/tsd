import * as path from 'path';
import test from 'ava';
import m from '../lib';

test('throw if no type definition was found', async t => {
	await t.throwsAsync(m({cwd: path.join(__dirname, 'fixtures/no-tsd')}), 'The type definition `index.d.ts` does not exist. Create one and try again.');
});

test('throw if no test is found', async t => {
	await t.throwsAsync(m({cwd: path.join(__dirname, 'fixtures/no-test')}), 'The test file `index.test-d.ts` does not exist. Create one and try again.');
});

test('return diagnostics', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/failure')});

	t.true(diagnostics.length === 1);
	t.is(diagnostics[0].message, 'Argument of type \'number\' is not assignable to parameter of type \'string\'.');
});

test('return diagnostics also from imported files', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/failure-nested')});

	t.true(diagnostics.length === 2);

	t.is(diagnostics[0].message, 'Argument of type \'number\' is not assignable to parameter of type \'string\'.');
	t.is(path.basename(diagnostics[0].fileName), 'child.test-d.ts');

	t.is(diagnostics[1].message, 'Argument of type \'number\' is not assignable to parameter of type \'string\'.');
	t.is(path.basename(diagnostics[1].fileName), 'index.test-d.ts');
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

test('fail if tests don\'t pass in strict mode', async t => {
	const diagnostics = await m({
		cwd: path.join(__dirname, 'fixtures/failure-strict-null-checks')
	});

	const {fileName, message, severity, line, column} = diagnostics[0];
	t.true(/failure-strict-null-checks\/index.test-d.ts$/.test(fileName));
	t.is(
		message,
		`Argument of type 'number | null' is not assignable to parameter of type 'number'.
  Type \'null\' is not assignable to type 'number'.`
	);
	t.is(severity, 'error');
	t.is(line, 4);
	t.is(column, 19);
});

test('pass in loose mode when strict mode is disabled in settings', async t => {
	const diagnostics = await m({
		cwd: path.join(__dirname, 'fixtures/non-strict-check-with-config')
	});

	t.true(diagnostics.length === 0);
});

test('return no diagnostics', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/success')});

	t.true(diagnostics.length === 0);
});

test('support top-level await', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/top-level-await')});

	t.true(diagnostics.length === 0);
});
