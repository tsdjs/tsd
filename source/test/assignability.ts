import path from 'node:path';
import test from 'ava';
import tsd from '../index.js';
import {verify} from './fixtures/utils.js';

test('assignable', async t => {
	const diagnostics = await tsd({cwd: path.resolve('fixtures/assignability/assignable')});

	verify(t, diagnostics, [
		[8, 26, 'error', 'Argument of type \'string\' is not assignable to parameter of type \'boolean\'.'],
	]);
});

test('not assignable', async t => {
	const diagnostics = await tsd({cwd: path.resolve('fixtures/assignability/not-assignable')});

	verify(t, diagnostics, [
		[4, 0, 'error', 'Argument of type `string` is assignable to parameter of type `string | number`.'],
		[5, 0, 'error', 'Argument of type `string` is assignable to parameter of type `any`.'],
	]);
});
