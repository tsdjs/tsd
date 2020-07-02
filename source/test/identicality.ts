import * as path from 'path';
import test from 'ava';
import {verify} from './fixtures/utils';
import tsd from '..';

test('identical', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/identicality/identical')});

	verify(t, diagnostics, [
		[7, 0, 'error', 'Parameter type `any` is not identical to argument type `number`.'],
		[8, 0, 'error', 'Parameter type `string | number` is declared too wide for argument type `string`.']
	]);
});

test('not identical', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/identicality/not-identical')});

	verify(t, diagnostics, [
		[7, 0, 'error', 'Parameter type `string` is identical to argument type `string`.']
	]);
});
