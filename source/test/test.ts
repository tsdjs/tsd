import * as path from 'path';
import test from 'ava';
import m from '../lib';

test('throw if no type definition was found', async t => {
	await t.throws(m({cwd: path.join(__dirname, 'fixtures')}), 'The type definition `index.d.ts` does not exist. Create one and try again.');
});

test('throw if no test is found', async t => {
	await t.throws(m({cwd: path.join(__dirname, 'fixtures/no-test')}), 'The test file `index.test-d.ts` does not exist. Create one and try again.');
});

test('return diagnostics', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/failure')});

	t.true(diagnostics.length === 1);
	t.is(diagnostics[0].messageText, 'Argument of type \'number\' is not assignable to parameter of type \'string\'.');
});

test('return no diagnostics', async t => {
	const diagnostics = await m({cwd: path.join(__dirname, 'fixtures/success')});

	t.true(diagnostics.length === 0);
});
