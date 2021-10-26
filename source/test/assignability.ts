import path from 'path';
import test from 'ava';
import {verify} from './fixtures/utils';
import tsd from '..';

test('assignable', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/assignability/assignable')});

	verify(t, diagnostics, [
		[8, 27, 'error', 'Argument of type \'string\' is not assignable to parameter of type \'boolean\'.']
	]);
});

test('not assignable', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/assignability/not-assignable')});

	verify(t, diagnostics, [
		[4, 1, 'error', 'Argument of type `string` is assignable to parameter of type `string | number`.'],
		[5, 1, 'error', 'Argument of type `string` is assignable to parameter of type `any`.'],
	]);
});
