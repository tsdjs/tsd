import path from 'node:path';
import test from 'ava';
import tsd from '../index.js';
import {verify} from './fixtures/utils.js';

test('identical', async t => {
	const diagnostics = await tsd({cwd: path.resolve('fixtures/identicality/identical')});

	verify(t, diagnostics, [
		[7, 0, 'error', 'Parameter type `any` is not identical to argument type `number`.'],
		[8, 0, 'error', 'Parameter type `string | number` is declared too wide for argument type `string`.'],
		[10, 0, 'error', 'Parameter type `false` is not identical to argument type `any`.'],
		[12, 0, 'error', 'Parameter type `string` is declared too wide for argument type `never`.'],
		[13, 0, 'error', 'Parameter type `any` is declared too wide for argument type `never`.'],
		[16, 0, 'error', 'Argument of type `number` is not `never`.'],
		[16, 12, 'error', 'Argument of type \'number\' is not assignable to parameter of type \'never\'.'],
	]);
});

test('not identical', async t => {
	const diagnostics = await tsd({cwd: path.resolve('fixtures/identicality/not-identical')});

	verify(t, diagnostics, [
		[7, 0, 'error', 'Parameter type `string` is identical to argument type `string`.'],
		[10, 0, 'error', 'Parameter type `any` is identical to argument type `any`.'],
	]);
});
