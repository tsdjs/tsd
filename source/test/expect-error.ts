import path from 'path';
import test from 'ava';
import {verify} from './fixtures/utils';
import tsd from '..';

test('expectError for classes', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/expect-error/classes')});

	verify(t, diagnostics, []);
});

test('expectError for functions', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/expect-error/functions')});

	verify(t, diagnostics, [
		[5, 0, 'error', 'Expected an error, but found none.']
	]);
});

test('expectError for generics', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/expect-error/generics')});

	verify(t, diagnostics, []);
});

test('expectError should not ignore syntactical errors', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/expect-error/syntax')});

	verify(t, diagnostics, [
		[4, 29, 'error', '\')\' expected.'],
		[5, 22, 'error', '\',\' expected.'],
	]);
});

test('expectError for values', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/expect-error/values')});

	verify(t, diagnostics, [
		[5, 0, 'error', 'Expected an error, but found none.']
	]);
});

test('expectError for values (noImplicitAny disabled)', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/expect-error/values-disabled-no-implicit-any')});

	verify(t, diagnostics, []);
});

test('expectError for values (exactOptionalPropertyTypes enabled)', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/expect-error/enabled-exact-optional-property-types')});

	verify(t, diagnostics, []);
});

test.failing('expectError for decorators', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/expect-error/decorators')});

	verify(t, diagnostics, []);
});

test('expectError for experimental decorators', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/expect-error/experimental-decorators')});

	verify(t, diagnostics, []);
});

test('expectError should report missing diagnostic codes', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/expect-error/missing-diagnostic-code')});

	verify(t, diagnostics, [
		[8, 12, 'error', 'Cannot find name \'undeclared\'.'],
		[5, 0, 'error', 'Expected an error, but found none.'],
		[8, 0, 'error', 'Found an error that tsd does not currently support (`ts2304`), consider creating an issue on GitHub.'],
	]);
});
