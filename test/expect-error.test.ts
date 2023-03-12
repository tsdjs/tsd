import path from 'path';
import {test} from 'vitest';
import {verify} from './fixtures/utils';
import {FIXTURES_PATH} from './fixtures/constants';
import tsd from '../dist';

test.concurrent('expectError for classes', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'expect-error/classes')});

	verify(diagnostics, []);
});

test.concurrent('expectError for functions', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'expect-error/functions')});

	verify(diagnostics, [
		[5, 0, 'error', 'Expected an error, but found none.']
	]);
});

test.concurrent('expectError for generics', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'expect-error/generics')});

	verify(diagnostics, []);
});

test.concurrent('expectError should not ignore syntactical errors', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'expect-error/syntax')});

	verify(diagnostics, [
		[4, 29, 'error', '\')\' expected.'],
		[5, 22, 'error', '\',\' expected.'],
	]);
});

test.concurrent('expectError for values', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'expect-error/values')});

	verify(diagnostics, [
		[5, 0, 'error', 'Expected an error, but found none.']
	]);
});

test.concurrent('expectError for values (noImplicitAny disabled)', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'expect-error/values-disabled-no-implicit-any')});

	verify(diagnostics, []);
});

test.concurrent('expectError for values (exactOptionalPropertyTypes enabled)', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'expect-error/enabled-exact-optional-property-types')});

	verify(diagnostics, []);
});

test.concurrent('expectError should report missing diagnostic codes', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'expect-error/missing-diagnostic-code')});

	verify(diagnostics, [
		[8, 12, 'error', 'Cannot find name \'undeclared\'.'],
		[5, 0, 'error', 'Expected an error, but found none.'],
		[8, 0, 'error', 'Found an error that tsd does not currently support (`ts2304`), consider creating an issue on GitHub.'],
	]);
});
