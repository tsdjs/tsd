import test from 'ava';
import {verifyTsdWithDiff, verifyCliFails} from './_utils.js';

test('diff', verifyTsdWithDiff, 'diff', [
	[8, 0, 'error', 'Parameter type `{ life?: number | undefined; }` is declared too wide for argument type `{ life: number; }`.', {
		expected: '{ life?: number | undefined; }',
		received: '{ life: number; }',
	}],
	[9, 0, 'error', 'Parameter type `FooFunction` is not identical to argument type `() => number`.', {
		expected: '(x?: string | undefined) => number',
		received: '() => number',
	}],
	[10, 0, 'error', 'Parameter type `FooType` is declared too wide for argument type `Required<FooType>`.', {
		expected: '{ foo?: "foo" | undefined; }',
		received: '{ foo: "foo"; }',
	}],
	[11, 0, 'error', 'Parameter type `Partial<FooInterface>` is declared too wide for argument type `Required<FooInterface>`.', {
		expected: '{ [x: string]: unknown; readonly protected?: boolean | undefined; fooType?: FooType | undefined; id?: "foo-interface" | undefined; }',
		received: '{ [x: string]: unknown; readonly protected: boolean; fooType: FooType; id: "foo-interface"; }',
	}],
	[13, 0, 'error', 'Argument of type `{ life: number; }` is assignable to parameter of type `{ life?: number | undefined; }`.', {
		expected: '{ life?: number | undefined; }',
		received: '{ life: number; }',
	}],
	[18, 0, 'error', 'Documentation comment `This is a comment.` for expression `commented` does not include expected `This is not the same comment!`.', {
		expected: 'This is not the same comment!',
		received: 'This is a comment.',
	}],
]);

test('diff cli', verifyCliFails, 'diff', ['--show-diff'], [
	'✖   8:0  Parameter type { life?: number | undefined; } is declared too wide for argument type { life: number; }.',
	'',
	'- { life?: number | undefined; }',
	'+ { life: number; }',
	'✖   9:0  Parameter type FooFunction is not identical to argument type () => number.',
	'',
	'- (x?: string | undefined) => number',
	'+ () => number',
	'✖  10:0  Parameter type FooType is declared too wide for argument type Required<FooType>.',
	'',
	'- { foo?: "foo" | undefined; }',
	'+ { foo: "foo"; }',
	'✖  11:0  Parameter type Partial<FooInterface> is declared too wide for argument type Required<FooInterface>.',
	'',
	'- { [x: string]: unknown; readonly protected?: boolean | undefined; fooType?: FooType | undefined; id?: "foo-interface" | undefined; }',
	'+ { [x: string]: unknown; readonly protected: boolean; fooType: FooType; id: "foo-interface"; }',
	'✖  13:0  Argument of type { life: number; } is assignable to parameter of type { life?: number | undefined; }.',
	'',
	'- { life?: number | undefined; }',
	'+ { life: number; }',
	'✖  18:0  Documentation comment This is a comment. for expression commented does not include expected This is not the same comment!.',
	'',
	'- This is not the same comment!',
	'+ This is a comment.',
	'',
	'6 errors',
]);
