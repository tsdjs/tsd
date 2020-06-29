import * as path from 'path';
import test from 'ava';
import {verify} from './fixtures/utils';
import tsd from '..';

test('throw if no type definition was found', async t => {
	await t.throwsAsync(tsd({cwd: path.join(__dirname, 'fixtures/no-tsd')}), {message: 'The type definition `index.d.ts` does not exist. Create one and try again.'});
});

test('throw if no test is found', async t => {
	await t.throwsAsync(tsd({cwd: path.join(__dirname, 'fixtures/no-test')}), {message: 'The test file `index.test-d.ts` or `index.test-d.tsx` does not exist. Create one and try again.'});
});

test('return diagnostics', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/failure')});

	verify(t, diagnostics, [
		[5, 19, 'error', 'Argument of type \'number\' is not assignable to parameter of type \'string\'.']
	]);
});

test('return diagnostics from imported files as well', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/failure-nested')});

	verify(t, diagnostics, [
		[5, 19, 'error', 'Argument of type \'number\' is not assignable to parameter of type \'string\'.', /child.test-d.ts$/],
		[6, 19, 'error', 'Argument of type \'number\' is not assignable to parameter of type \'string\'.', /index.test-d.ts$/]
	]);
});

test('fail if typings file is not part of `files` list', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/no-files')});

	verify(t, diagnostics, [
		[3, 1, 'error', 'TypeScript type definition `index.d.ts` is not part of the `files` list.', 'package.json'],
	]);
});

test('allow specifying folders containing typings file in `files` list', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/files-folder')});

	verify(t, diagnostics, []);
});

test('allow specifying glob patterns containing typings file in `files` list', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/files-glob')});

	verify(t, diagnostics, []);
});

test('fail if `typings` property is used instead of `types`', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/types-property/typings')});

	verify(t, diagnostics, [
		[3, 1, 'error', 'Use property `types` instead of `typings`.', 'package.json'],
	]);
});

test('fail if tests don\'t pass in strict mode', async t => {
	const diagnostics = await tsd({
		cwd: path.join(__dirname, 'fixtures/failure-strict-null-checks')
	});

	verify(t, diagnostics, [
		[4, 19, 'error', 'Argument of type \'number | null\' is not assignable to parameter of type \'number\'.\n  Type \'null\' is not assignable to type \'number\'.', /failure-strict-null-checks\/index.test-d.ts$/],
	]);
});

test('overridden config defaults to `strict` if `strict` is not explicitly overridden', async t => {
	const diagnostics = await tsd({
		cwd: path.join(__dirname, 'fixtures/strict-null-checks-as-default-config-value')
	});

	verify(t, diagnostics, [
		[4, 19, 'error', 'Argument of type \'number | null\' is not assignable to parameter of type \'number\'.\n  Type \'null\' is not assignable to type \'number\'.', /strict-null-checks-as-default-config-value\/index.test-d.ts$/],
	]);
});

test('fail if types are used from a lib that was not explicitly specified', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/lib-config/failure-missing-lib')});

	verify(t, diagnostics, [
		[1, 22, 'error', 'Cannot find name \'Window\'.', /failure-missing-lib\/index.d.ts$/],
		[4, 11, 'error', 'Cannot find name \'Window\'.', /failure-missing-lib\/index.test-d.ts$/]
	]);
});

test('allow specifying a lib as a triple-slash-reference', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/lib-config/lib-as-triple-slash-reference')});

	verify(t, diagnostics, []);
});

test('allow specifying a lib in package.json\'s `tsd` field', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/lib-config/lib-from-package-json')});

	verify(t, diagnostics, []);
});

test('allow specifying a lib in tsconfig.json', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/lib-config/lib-from-tsconfig-json')});

	verify(t, diagnostics, []);
});

test('a lib option in package.json overrdides a lib option in tsconfig.json', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/lib-config/lib-from-package-json-overrides-tsconfig-json')});

	verify(t, diagnostics, []);
});

test('pass in loose mode when strict mode is disabled in settings', async t => {
	const diagnostics = await tsd({
		cwd: path.join(__dirname, 'fixtures/non-strict-check-with-config')
	});

	verify(t, diagnostics, []);
});

test('return no diagnostics', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/success')});

	verify(t, diagnostics, []);
});

test('support non-barrel main', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/test-non-barrel-main')});

	verify(t, diagnostics, []);
});

test('support non-barrel main using `types` property', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/test-non-barrel-main-via-types')});

	verify(t, diagnostics, []);
});

test('support testing in sub-directories', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/test-in-subdir')});

	verify(t, diagnostics, []);
});

test('support top-level await', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/top-level-await')});

	verify(t, diagnostics, []);
});

test('support default test directory', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/test-directory/default')});

	verify(t, diagnostics, []);
});

test('support tsx in subdirectory', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/test-directory/tsx')});

	verify(t, diagnostics, []);
});

test('support setting a custom test directory', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/test-directory/custom')});

	verify(t, diagnostics, [
		[4, 0, 'error', 'Expected an error, but found none.']
	]);
});

test('expectError for functions', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/expect-error/functions')});

	verify(t, diagnostics, [
		[5, 0, 'error', 'Expected an error, but found none.']
	]);
});

test('expectError should not ignore syntactical errors', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/expect-error/syntax')});

	verify(t, diagnostics, [
		[4, 29, 'error', '\')\' expected.'],
		[5, 22, 'error', '\',\' expected.'],
		[4, 0, 'error', 'Expected an error, but found none.'],
		[5, 0, 'error', 'Expected an error, but found none.']
	]);
});

test('expectError for values', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/expect-error/values')});

	verify(t, diagnostics, [
		[5, 0, 'error', 'Expected an error, but found none.']
	]);
});

test('missing import', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/missing-import')});

	verify(t, diagnostics, [
		[3, 18, 'error', 'Cannot find name \'Primitive\'.']
	]);
});

test('tsx', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/tsx')});

	verify(t, diagnostics, []);
});

test('loose types', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/strict-types/loose')});

	verify(t, diagnostics, [
		[5, 0, 'error', 'Parameter type `string` is declared too wide for argument type `"cat"`.'],
		[7, 0, 'error', 'Parameter type `string | number` is declared too wide for argument type `string`.'],
		[8, 0, 'error', 'Parameter type `string | number` is declared too wide for argument type `number`.'],
		[10, 0, 'error', 'Parameter type `string | Date` is declared too wide for argument type `Date`.'],
		[11, 0, 'error', 'Parameter type `Promise<string | number>` is declared too wide for argument type `Promise<number>`.'],
		[12, 0, 'error', 'Parameter type `string | Promise<string | number>` is declared too wide for argument type `Promise<string | number>`.'],
		[14, 0, 'error', 'Parameter type `Promise<string | number>` is declared too wide for argument type `Promise<number>`.'],
		[16, 0, 'error', 'Parameter type `Observable<string | number>` is declared too wide for argument type `Observable<string>`.'],
		[20, 0, 'error', 'Parameter type `Observable<string | number> | Observable<string | number | boolean>` is declared too wide for argument type `Observable<string | number> | Observable<string>`.'],
		[28, 0, 'error', 'Parameter type `Foo<string | Foo<string | number>> | Foo<Date> | Foo<Symbol>` is declared too wide for argument type `Foo<Date> | Foo<Symbol> | Foo<string | Foo<number>>`.'],
		[32, 0, 'error', 'Parameter type `string | number` is not identical to argument type `any`.'],
		[34, 0, 'error', 'Parameter type `Observable<string | number> | Observable<any> | Observable<string | number | boolean>` is not identical to argument type `Observable<string | number> | Observable<string> | Observable<string | number | boolean>`.']
	]);
});

test('strict types', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/strict-types/strict')});

	verify(t, diagnostics, []);
});
