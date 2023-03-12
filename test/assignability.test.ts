import path from 'path';
import {test} from 'vitest';
import tsd from '../source';
import {verify} from './fixtures/utils';

test.concurrent('assignable', async () => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/assignability/assignable')});

	verify(diagnostics, [
		[8, 26, 'error', 'Argument of type \'string\' is not assignable to parameter of type \'boolean\'.']
	]);
});

test.concurrent('not assignable', async () => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/assignability/not-assignable')});

	verify(diagnostics, [
		[4, 0, 'error', 'Argument of type `string` is assignable to parameter of type `string | number`.'],
		[5, 0, 'error', 'Argument of type `string` is assignable to parameter of type `any`.'],
	]);
});
