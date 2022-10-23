import tsd from '..';
import test from 'ava';
import path from 'path';
import {verify} from './fixtures/utils';

test('jest like API parser error', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/jest-like-api/parser-error')});

	verify(t, diagnostics, [
		[4, 0, 'error', 'Missing right side method, expected something like `assertType(\'hello\').assignableTo<string>()`.'],
		[5, 0, 'error', 'Missing right side method, expected something like `assertType(\'hello\').not.assignableTo<string>()`.'],
		[8, 0, 'error', 'Missing right side method, expected something like `assertType(\'hello\').assignableTo<string>()`.'],
		[10, 0, 'error', 'Missing right side method, expected something like `assertType(\'hello\').assignableTo<string>()`.'],
		[13, 0, 'error', 'A generic type or an argument value is required.'],
		[14, 0, 'error', 'A generic type or an argument value is required.'],
		[19, 11, 'error', 'Do not provide a generic type and an argument value at the same time.'],
		[20, 33, 'error', 'Do not provide a generic type and an argument value at the same time.'],
		[15, 0, 'error', 'A generic type or an argument value is required.'],
		[16, 0, 'error', 'A generic type or an argument value is required.'],
		[21, 11, 'error', 'Do not provide a generic type and an argument value at the same time.'],
		[22, 37, 'error', 'Do not provide a generic type and an argument value at the same time.'],
	]);
});

test('identical-to', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/jest-like-api/identical-to')});

	verify(t, diagnostics, [
		[13, 0, 'error', 'Expected type `string` is declared too wide for type `number`.'],
		[14, 0, 'error', 'Expected type `number` is declared too wide for type `string`.'],
		[15, 0, 'error', 'Expected type `string` is declared too wide for type `number`.'],
		[16, 0, 'error', 'Expected type `string` is declared too wide for type `number`.'],
		[19, 0, 'error', 'Expected type `"foo"` is declared too short for type `string`.'],
		[20, 0, 'error', 'Expected type `"foo"` is declared too short for type `string`.'],
		[21, 0, 'error', 'Expected type `"foo"` is declared too short for type `string`.'],
		[22, 0, 'error', 'Expected type `"foo"` is declared too short for type `string`.'],
		[32, 0, 'error', 'Expected type `string` is declared too wide for type `"foo"`.'],
		[33, 0, 'error', 'Expected type `"foo"` is declared too short for type `string`.'],
	]);
});

test('not-identical-to', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/jest-like-api/not-identical-to')});

	verify(t, diagnostics, [
		[13, 0, 'error', 'Expected type `string` is identical to type `string`.'],
		[14, 0, 'error', 'Expected type `string` is identical to type `string`.'],
		[15, 0, 'error', 'Expected type `string` is identical to type `string`.'],
		[16, 0, 'error', 'Expected type `string` is identical to type `string`.'],
		[32, 0, 'error', 'Expected type `"foo"` is identical to type `"foo"`.'],
		[33, 0, 'error', 'Expected type `"foo"` is identical to type `"foo"`.'],
	]);
});

test('assignable-to', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/jest-like-api/assignable-to')});

	verify(t, diagnostics, [
		[13, 0, 'error', 'Expected type `string` is not assignable to type `number`.'],
		[14, 0, 'error', 'Expected type `number` is not assignable to type `string`.'],
		[15, 0, 'error', 'Expected type `string` is not assignable to type `number`.'],
		[16, 0, 'error', 'Expected type `string` is not assignable to type `number`.'],
		[25, 0, 'error', 'Expected type `string` is not assignable to type `"foo"`.'],
		[26, 0, 'error', 'Expected type `string` is not assignable to type `"foo"`.'],
		[27, 0, 'error', 'Expected type `string` is not assignable to type `"foo"`.'],
		[28, 0, 'error', 'Expected type `string` is not assignable to type `"foo"`.'],
		[38, 0, 'error', 'Expected type `string` is not assignable to type `"foo"`.'],
		[39, 0, 'error', 'Expected type `"foo"` is not assignable to type `number`.'],
	]);
});

test('not-assignable-to', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/jest-like-api/not-assignable-to')});

	verify(t, diagnostics, [
		[13, 0, 'error', 'Expected type `string` is assignable to type `string`.'],
		[14, 0, 'error', 'Expected type `string` is assignable to type `string`.'],
		[15, 0, 'error', 'Expected type `string` is assignable to type `string`.'],
		[16, 0, 'error', 'Expected type `string` is assignable to type `string`.'],
		[25, 0, 'error', 'Expected type `"foo"` is assignable to type `string`.'],
		[26, 0, 'error', 'Expected type `"foo"` is assignable to type `string`.'],
		[27, 0, 'error', 'Expected type `"foo"` is assignable to type `string`.'],
		[28, 0, 'error', 'Expected type `"foo"` is assignable to type `string`.'],
		[38, 0, 'error', 'Expected type `"foo"` is assignable to type `"foo"`.'],
		[39, 0, 'error', 'Expected type `"foo"` is assignable to type `"foo"`.'],
		[58, 0, 'error', 'Expected type `string` is assignable to type `any`.'],
		[59, 0, 'error', 'Expected type `Bar` is assignable to type `number`.'],
		[60, 0, 'error', 'Expected type `{ id: number; name: string; }` is assignable to type `Foo`.'],
		[63, 0, 'error', 'Expected type `any` is assignable to type `string`.'],
		[64, 0, 'error', 'Expected type `number` is assignable to type `Bar`.'],
		[65, 0, 'error', 'Expected type `Baz` is assignable to type `Foo`.'],
	]);
});

test('subtype-of', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/jest-like-api/subtype-of')});

	verify(t, diagnostics, [
		[13, 0, 'error', 'Expected type `string` is not a subtype of `number`.'],
		[14, 0, 'error', 'Expected type `number` is not a subtype of `string`.'],
		[15, 0, 'error', 'Expected type `string` is not a subtype of `number`.'],
		[16, 0, 'error', 'Expected type `string` is not a subtype of `number`.'],
		[25, 0, 'error', 'Expected type `string` is not a subtype of `"foo"`.'],
		[26, 0, 'error', 'Expected type `string` is not a subtype of `"foo"`.'],
		[27, 0, 'error', 'Expected type `string` is not a subtype of `"foo"`.'],
		[28, 0, 'error', 'Expected type `string` is not a subtype of `"foo"`.'],
		[38, 0, 'error', 'Expected type `string` is not a subtype of `"foo"`.'],
		[39, 0, 'error', 'Expected type `"foo"` is not a subtype of `number`.'],
		[63, 0, 'error', 'Expected type `any` is not a subtype of `string`.'],
		[64, 0, 'error', 'Expected type `number` is not a subtype of `Bar`.'],
		[65, 0, 'error', 'Expected type `Baz` is not a subtype of `Foo`.'],
	]);
});

test('not-subtype-of', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/jest-like-api/not-subtype-of')});

	verify(t, diagnostics, [
		[13, 0, 'error', 'Expected type `string` is a subtype of `string`.'],
		[14, 0, 'error', 'Expected type `string` is a subtype of `string`.'],
		[15, 0, 'error', 'Expected type `string` is a subtype of `string`.'],
		[16, 0, 'error', 'Expected type `string` is a subtype of `string`.'],
		[25, 0, 'error', 'Expected type `"foo"` is a subtype of `string`.'],
		[26, 0, 'error', 'Expected type `"foo"` is a subtype of `string`.'],
		[27, 0, 'error', 'Expected type `"foo"` is a subtype of `string`.'],
		[28, 0, 'error', 'Expected type `"foo"` is a subtype of `string`.'],
		[38, 0, 'error', 'Expected type `"foo"` is a subtype of `"foo"`.'],
		[39, 0, 'error', 'Expected type `"foo"` is a subtype of `"foo"`.'],
		[63, 0, 'error', 'Expected type `string` is a subtype of `any`.'],
		[64, 0, 'error', 'Expected type `Bar` is a subtype of `number`.'],
		[65, 0, 'error', 'Expected type `{ id: number; name: string; }` is a subtype of `Foo`.'],
	]);
});

// // Debug
// test('debug', async () => {
// 	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/jest-like-api/identicality')});
// 	console.log(diagnostics);
// });
