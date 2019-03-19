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

test('fail if `typings` property is used instead of `types`', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/types-property/typings')});

	t.deepEqual(diagnostics, [
		{
			fileName: 'package.json',
			message: 'Use property `types` instead of `typings`.',
			severity: 'error',
			column: 1,
			line: 3
		}
	]);
});

test('fail if tests don\'t pass in strict mode', async t => {
	function assert(diagnostics, expectedFilePathRe) {
		const {fileName, message, severity, line, column} = diagnostics[0];
		t.true(new RegExp(expectedFilePathRe).test(fileName));
		t.is(
			message,
			`Argument of type 'number | null' is not assignable to parameter of type 'number'.
  Type \'null\' is not assignable to type 'number'.`
		);
		t.is(severity, 'error');
		t.is(line, 4);
		t.is(column, 19);
	}

	assert(
		await m({cwd: path.join(__dirname, 'fixtures/failure-strict-null-checks')}),
		'failure-strict-null-checks\\/index.test-d.ts$'
	);
	assert(
		await m({cwd: path.join(__dirname, 'fixtures/failure-strict-null-checks-as-default-config-value')}),
		'failure-strict-null-checks-as-default-config-value\\/index.test-d.ts$'
	);
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

test('support non-barrel main', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/test-non-barrel-main')});

	t.true(diagnostics.length === 0);
});

test('support non-barrel main using `types` property', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/test-non-barrel-main-via-types')});

	t.true(diagnostics.length === 0);
});

test('support testing in sub-directories', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/test-in-subdir')});

	t.true(diagnostics.length === 0);
});

test('support top-level await', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/top-level-await')});

	t.true(diagnostics.length === 0);
});

test('support default test directory', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/test-directory/default')});

	t.true(diagnostics.length === 0);
});

test('support setting a custom test directory', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/test-directory/custom')});

	t.true(diagnostics[0].column === 0);
	t.true(diagnostics[0].line === 4);
	t.true(diagnostics[0].message === 'Expected an error, but found none.');
	t.true(diagnostics[0].severity === 'error');
});

test('expectError for functions', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/expect-error/functions')});

	t.true(diagnostics.length === 1);

	t.true(diagnostics[0].column === 0);
	t.true(diagnostics[0].line === 5);
	t.true(diagnostics[0].message === 'Expected an error, but found none.');
	t.true(diagnostics[0].severity === 'error');
});

test('expectError should not ignore syntactical errors', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/expect-error/syntax')});

	t.true(diagnostics.length === 4);

	t.true(diagnostics[0].column === 29);
	t.true(diagnostics[0].line === 4);
	t.true(diagnostics[0].message === '\')\' expected.');
	t.true(diagnostics[0].severity === 'error');

	t.true(diagnostics[1].column === 22);
	t.true(diagnostics[1].line === 5);
	t.true(diagnostics[1].message === '\',\' expected.');
	t.true(diagnostics[1].severity === 'error');

	t.true(diagnostics[2].column === 0);
	t.true(diagnostics[2].line === 4);
	t.true(diagnostics[2].message === 'Expected an error, but found none.');
	t.true(diagnostics[2].severity === 'error');

	t.true(diagnostics[3].column === 0);
	t.true(diagnostics[3].line === 5);
	t.true(diagnostics[3].message === 'Expected an error, but found none.');
	t.true(diagnostics[3].severity === 'error');
});

test('expectError for values', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/expect-error/values')});

	t.true(diagnostics.length === 1);

	t.true(diagnostics[0].column === 0);
	t.true(diagnostics[0].line === 4);
	t.true(diagnostics[0].message === 'Expected an error, but found none.');
	t.true(diagnostics[0].severity === 'error');
});
