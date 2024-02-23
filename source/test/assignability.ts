import test from 'ava';
import {verifyTsd} from './_utils.js';

test('assignable', verifyTsd, 'assignability/assignable', [
	[8, 26, 'error', 'Argument of type \'string\' is not assignable to parameter of type \'boolean\'.'],
]);

test('not assignable', verifyTsd, 'assignability/not-assignable', [
	[4, 0, 'error', 'Argument of type `string` is assignable to parameter of type `string | number`.'],
	[5, 0, 'error', 'Argument of type `string` is assignable to parameter of type `any`.'],
]);
