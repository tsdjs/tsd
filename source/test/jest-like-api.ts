import tsd from '..';
import test from 'ava';
import path from 'path';
import {verify} from './fixtures/utils';

test('jest like API', async t => {
	const diagnostics = await tsd({cwd: path.join(__dirname, 'fixtures/jest-like-api')});

	verify(t, diagnostics, [
		[6, 0, 'error', 'Missing right side method, expected something like `assertType(\'hello\').assignableTo<string>()`.'],
		[7, 0, 'error', 'Missing right side method, expected something like `assertType(\'hello\').not.assignableTo<string>()`.'],
		[10, 0, 'error', 'Missing right side method, expected something like `assertType(\'hello\').assignableTo<string>()`.'],
		[12, 0, 'error', 'Missing right side method, expected something like `assertType(\'hello\').assignableTo<string>()`.'],
	]);
});
