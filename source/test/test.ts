import path from 'node:path';
import test from 'ava';
import tsd from '../index.js';
import {type Diagnostic, TsdError} from '../lib/interfaces.js';
import {
	verify,
	verifyTsd,
	verifyTsdFails,
	verifyTsdWithFileNames,
	noDiagnostics,
} from './_utils.js';

// TODO: remove unused fixtures

test('throw if no test is found', verifyTsdFails, 'no-test', cwd => (
	`No test files were found in \`${cwd}\` or in any of its subdirectories.`
));

test('return diagnostics', verifyTsd, 'failure', [
	[5, 19, 'error', 'Argument of type \'number\' is not assignable to parameter of type \'string\'.'],
]);

test('return diagnostics from imported files as well', verifyTsdWithFileNames, 'failure-nested', [
	[5, 19, 'error', 'Argument of type \'number\' is not assignable to parameter of type \'string\'.', 'child.test-d.ts'],
	[6, 19, 'error', 'Argument of type \'number\' is not assignable to parameter of type \'string\'.', 'index.test-d.ts'],
]);

test('fail if tests don\'t pass in strict mode', verifyTsdWithFileNames, 'failure-strict-null-checks', [
	[4, 19, 'error', 'Argument of type \'number | null\' is not assignable to parameter of type \'number\'.\n  Type \'null\' is not assignable to type \'number\'.', 'index.test-d.ts'],
]);

test('overridden config defaults to `strict` if `strict` is not explicitly overridden', verifyTsdWithFileNames, 'strict-null-checks-as-default-config-value', [
	[4, 19, 'error', 'Argument of type \'number | null\' is not assignable to parameter of type \'number\'.\n  Type \'null\' is not assignable to type \'number\'.', 'index.test-d.ts'],
]);

test('fail if types are used from a lib that was not explicitly specified', verifyTsdWithFileNames, 'lib-config/failure-missing-lib', [
	[1, 22, 'error', 'Cannot find name \'Window\'.', 'index.d.ts'],
	[4, 11, 'error', 'Cannot find name \'Window\'.', 'index.test-d.ts'],
]);

test('allow specifying a lib as a triple-slash-reference', noDiagnostics, 'lib-config/lib-as-triple-slash-reference');

test('allow specifying a lib in package.json\'s `tsd` field', noDiagnostics, 'lib-config/lib-from-package-json');

test('allow specifying a lib in tsconfig.json', noDiagnostics, 'lib-config/lib-from-tsconfig-json');

test('use moduleResolution `nodenext` when module is `nodenext` in tsconfig.json', noDiagnostics, 'module-resolution/nodenext-from-tsconfig-json');

test('use moduleResolution `nodenext` when module is `nodenext` in package.json', noDiagnostics, 'module-resolution/nodenext-from-package-json');

test('use moduleResolution `node16` when module is `node16` in tsconfig.json', noDiagnostics, 'module-resolution/node16-from-tsconfig-json');

test('use moduleResolution `node16` when module is `node16` in package.json', noDiagnostics, 'module-resolution/node16-from-package-json');

test('add DOM support by default', noDiagnostics, 'dom');

test('a lib option in package.json overrdides a lib option in tsconfig.json', noDiagnostics, 'lib-config/lib-from-package-json-overrides-tsconfig-json');

test('pass in loose mode when strict mode is disabled in settings', noDiagnostics, 'non-strict-check-with-config');

test('return no diagnostics', noDiagnostics, 'success');

test('support non-barrel main', noDiagnostics, 'test-non-barrel-main');

test('support testing in sub-directories', noDiagnostics, 'test-in-subdir');

test('support top-level await', noDiagnostics, 'top-level-await');

test('support default test directory', noDiagnostics, 'test-directory/default');

test('support tsx in subdirectory', noDiagnostics, 'test-directory/tsx');

test('support setting a custom test directory', verifyTsd, 'test-directory/custom', [
	[4, 0, 'error', 'Expected an error, but found none.'],
]);

test('missing import', verifyTsd, 'missing-import', [
	[3, 18, 'error', 'Cannot find name \'Primitive\'.'],
]);

test('tsx component', noDiagnostics, 'tsx');

test('loose types', verifyTsd, 'strict-types/loose', [
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
	[34, 0, 'error', 'Parameter type `Observable<any> | Observable<string | number> | Observable<string | number | boolean>` is not identical to argument type `Observable<string | number> | Observable<string> | Observable<string | number | boolean>`.'],
]);

test('strict types', noDiagnostics, 'strict-types/strict');

test('typings in custom directory', verifyTsd, 'typings-custom-dir', [
	[5, 19, 'error', 'Argument of type \'number\' is not assignable to parameter of type \'string\'.'],
]);

test('specify test files manually', verifyTsd,
	{fixtureName: 'specify-test-files', tsdOptions: {testFiles: ['unknown.test.ts', 'second.test.ts']}}, [
		[5, 19, 'error', 'Argument of type \'number\' is not assignable to parameter of type \'string\'.'],
	],
);

test('fails if typings file is not found in the specified path', verifyTsdFails,
	{fixtureName: 'typings-custom-dir', tsdOptions: {testFiles: ['unknown.test.ts']}},
	() => 'Could not find any test files with the given pattern(s).',
);

test('includes extended config files along with found ones', verifyTsd, 'ts-config-extends', [
	[6, 64, 'error', 'Not all code paths return a value.'],
]);

test('errors in libs from node_modules are not reported', async t => {
	const diagnostics = await tsd({cwd: path.resolve('fixtures/exclude-node-modules')});

	// eslint-disable-next-line unicorn/no-array-reduce
	const [nodeModuleDiagnostics, testFileDiagnostics, otherDiagnostics] = diagnostics.reduce<Diagnostic[][]>(
		([nodeModuleDiags, testFileDiags, otherDiags], diagnostic) => {
			if (/[/\\]node_modules[/\\]/.test(diagnostic.fileName)) {
				nodeModuleDiags.push(diagnostic);
			} else if (/[/\\]fixtures[/\\]exclude-node-modules[/\\]/.test(diagnostic.fileName)) {
				testFileDiags.push(diagnostic);
			} else {
				otherDiags.push(diagnostic);
			}

			return [nodeModuleDiags, testFileDiags, otherDiags];
		},
		[[], [], []],
	);

	t.is(
		nodeModuleDiagnostics.length,
		0,
		'There must be no errors from node_modules folders when standard lib is not available (option `"noLib": true`).',
	);

	t.true(
		otherDiagnostics.length > 0,
		'There must be errors from tsd lib when standard lib is not available (option `"noLib": true`).',
	);

	const alloweOtherFileFailures = [
		/[/\\]lib[/\\]index.d.ts$/,
		/[/\\]lib[/\\]interfaces.d.ts$/,
	];
	for (const diagnostic of otherDiagnostics) {
		t.true(
			alloweOtherFileFailures.some(allowedFileRe => allowedFileRe.test(diagnostic.fileName)),
			`Found diagnostic from an unexpected file: ${diagnostic.fileName} - ${diagnostic.message}`,
		);
	}

	verify(t, testFileDiagnostics, [
		[3, 18, 'error', 'Cannot find name \'Bar\'.'],
	]);
});

test('allow specifying `rootDir` option in `tsconfig.json`', noDiagnostics, 'root-dir');

test('assertions should be identified if imported as an aliased module', noDiagnostics, 'aliased/aliased-module');

test('assertions should be identified if imported as an alias', noDiagnostics, 'aliased/aliased-assertion');

test('assertions should be identified if aliased', noDiagnostics, 'aliased/aliased-const');

test('parsing undefined symbol should not fail', noDiagnostics, 'undefined-symbol');

test('custom tsd errors are created correctly', t => {
	const tsdError = t.throws<TsdError>(() => {
		throw new TsdError('foo');
	});

	t.true(tsdError instanceof Error);
	t.true(tsdError instanceof TsdError);
	t.is(tsdError?.name, 'TsdError');
	t.is(tsdError?.message, 'foo');
});

// TODO: provide export like tsd/assertions?
