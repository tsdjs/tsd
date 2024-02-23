import test from 'ava';
import {verifyTsd} from './_utils.js';

test('deprecated', verifyTsd, 'deprecated/expect-deprecated', [
	[6, 0, 'error', 'Expected `(foo: number, bar: number): number` to be marked as `@deprecated`'],
	[15, 0, 'error', 'Expected `Options.delimiter` to be marked as `@deprecated`'],
	[19, 0, 'error', 'Expected `Unicorn.RAINBOW` to be marked as `@deprecated`'],
	[34, 0, 'error', 'Expected `RainbowClass` to be marked as `@deprecated`'],
]);

test('not deprecated', verifyTsd, 'deprecated/expect-not-deprecated', [
	[5, 0, 'error', 'Expected `(foo: string, bar: string): string` to not be marked as `@deprecated`'],
	[14, 0, 'error', 'Expected `Options.separator` to not be marked as `@deprecated`'],
	[18, 0, 'error', 'Expected `Unicorn.UNICORN` to not be marked as `@deprecated`'],
	[33, 0, 'error', 'Expected `UnicornClass` to not be marked as `@deprecated`'],
]);
