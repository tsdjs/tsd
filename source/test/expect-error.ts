import test from 'ava';
import {verifyTsd, noDiagnostics} from './_utils.js';

test('expectError for classes', noDiagnostics, 'expect-error/classes');

test('expectError for functions', verifyTsd, 'expect-error/functions', [
	[5, 0, 'error', 'Expected an error, but found none.'],
]);

test('expectError for generics', noDiagnostics, 'expect-error/generics');

test('expectError should not ignore syntactical errors', verifyTsd, 'expect-errors/syntax', [
	[4, 29, 'error', '\')\' expected.'],
	[5, 22, 'error', '\',\' expected.'],
]);

test('expectError for values', verifyTsd, 'expect-error/values', [
	[5, 0, 'error', 'Expected an error, but found none.'],
]);

test('expectError for values (noImplicitAny disabled)', noDiagnostics, 'expect-error/values-disabled-no-implicit-any');

test('expectError for values (exactOptionalPropertyTypes enabled)', noDiagnostics, 'expect-error/enabled-exact-optional-property-types');

test('expectError for decorators', noDiagnostics, 'expect-error/decorators');

test('expectError for experimental decorators', noDiagnostics, 'expect-error/experimental-decorators');

test('expectError should report missing diagnostic codes', verifyTsd, 'expect-error/missing-diagnostic-code', [
	[8, 12, 'error', 'Cannot find name \'undeclared\'.'],
	[5, 0, 'error', 'Expected an error, but found none.'],
	[8, 0, 'error', 'Found an error that tsd does not currently support (`ts2304`), consider creating an issue on GitHub.'],
]);
