import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('loose types', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'strict-types/loose')});

	verify(diagnostics, [
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
		[34, 0, 'error', 'Parameter type `Observable<any> | Observable<string | number> | Observable<string | number | boolean>` is not identical to argument type `Observable<string | number> | Observable<string> | Observable<string | number | boolean>`.']
	]);
});

test.concurrent('strict types', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'strict-types/strict')});

	verify(diagnostics, []);
});
