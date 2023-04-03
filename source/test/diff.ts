import path from 'node:path';
import {execa, type ExecaError} from 'execa';
import test from 'ava';
import tsd from '../index.js';
import {verifyWithDiff} from './fixtures/utils.js';

test('diff', async t => {
	const diagnostics = await tsd({cwd: path.resolve('fixtures/diff')});

	verifyWithDiff(t, diagnostics, [
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
});

test('diff cli', async t => {
	const file = path.resolve('fixtures/diff');

	const {exitCode, stderr} = await t.throwsAsync<ExecaError>(execa('tsx ../cli.js', [file, '--show-diff']));

	t.is(exitCode, 1);

	const expectedLines = [
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
	];

	// NOTE: If lines are added to the output in the future startLine and endLine should be adjusted.
	const startLine = 2; // Skip tsd error message and file location.
	const endLine = startLine + expectedLines.length; // Grab diff output only and skip stack trace.

	const receivedLines = stderr.trim().split('\n').slice(startLine, endLine).map(line => line.trim());

	t.deepEqual(receivedLines, expectedLines);
});
