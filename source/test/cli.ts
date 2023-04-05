import path from 'node:path';
import test from 'ava';
import {execa, type ExecaError} from 'execa';
import {readPackageUp} from 'read-pkg-up';
import resolveFrom from 'resolve-from';
import tsd, {formatter} from '../index.js';
import {
	binPath,
	getFixture,
	verifyCli,
	verifyCliPasses,
	verifyCliFails,
} from './_utils.js';

// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain, unicorn/no-await-expression-member
const pkg = (await readPackageUp())?.packageJson!;

test('fail if errors are found', verifyCliFails, 'failure', [], [
	'✖  5:19  Argument of type number is not assignable to parameter of type string.',
	'',
	'1 error',
]);

test('succeed if no errors are found', verifyCliPasses, 'success', [], []);

test('provide a path', verifyCliFails, '', [getFixture('failure')], [
	'✖  5:19  Argument of type number is not assignable to parameter of type string.',
	'',
	'1 error',
]);

test('cli help flag: --help', verifyCliPasses, '', ['--help'], [
	'Usage',
]);

test('cli version flag: --version', verifyCliPasses, '', ['--version'], [pkg.version]);

test('cli typings flag: --typings', verifyCliFails, 'typings-custom-dir', ['--typings', 'utils/index.d.ts'], [
	'✖  5:19  Argument of type number is not assignable to parameter of type string.',
	'',
	'1 error',
]);

test('cli typings flag: -t', verifyCliFails, 'typings-custom-dir', ['-t', 'utils/index.d.ts'], [
	'✖  5:19  Argument of type number is not assignable to parameter of type string.',
	'',
	'1 error',
]);

test('cli files flag: --files', verifyCliFails, 'specify-test-files', ['--files', 'unknown.test.ts'], [
	'✖  5:19  Argument of type number is not assignable to parameter of type string.',
	'',
	'1 error',
]);

test('cli files flag: -f', verifyCliFails, 'specify-test-files', ['-f', 'unknown.test.ts'], [
	'✖  5:19  Argument of type number is not assignable to parameter of type string.',
	'',
	'1 error',
]);

test('cli files flag: array', verifyCliFails, 'specify-test-files', ['--files', 'unknown.test.ts', '--files', 'second.test.ts'], [
	'✖  5:19  Argument of type number is not assignable to parameter of type string.',
	'',
	'1 error',
]);

test('cli typings and files flags', verifyCliFails, 'typings-custom-dir', ['-t', 'utils/index.d.ts', '-f', 'index.test-d.ts'], [
	'✖  5:19  Argument of type number is not assignable to parameter of type string.',
	'',
	'1 error',
]);

test('tsd logs stacktrace on failure', verifyCliFails, 'empty-package-json', [], () => {
	const nodeModulesPath = path.resolve('node_modules');
	const parseJsonPath = resolveFrom.silent(`${nodeModulesPath}/read-pkg`, 'parse-json') ?? `${nodeModulesPath}/index.js`;

	return [
		'Error running tsd:',
		'JSONError: Unexpected end of JSON input while parsing empty string',
		`at parseJson (${parseJsonPath}:29:21)`,
		`at module.exports (${nodeModulesPath}/read-pkg/index.js:17:15)`,
		`at async module.exports (${nodeModulesPath}/read-pkg-up/index.js:14:16)`,
	];
}, {startLine: 0});

test('exported formatter matches cli results', async t => {
	const options = {cwd: getFixture('failure')};

	const {stderr: cliResults} = await t.throwsAsync<ExecaError>(execa(binPath, options));
	const formattedTsdResults = formatter(await tsd(options));

	verifyCli(t, cliResults, [
		'✖  5:19  Argument of type number is not assignable to parameter of type string.',
		'',
		'1 error',
	]);

	verifyCli(t, formattedTsdResults, [
		'✖  5:19  Argument of type number is not assignable to parameter of type string.',
		'',
		'1 error',
	]);
});

test('warnings are reported correctly and do not fail', verifyCliPasses, 'warnings/only-warnings', [], [
	'⚠  4:0  Type for expression one(1, 1) is: number',
	'',
	'1 warning',
]);

test('warnings are reported with errors', verifyCliFails, 'warnings/with-errors', [], [
	'✖  5:19  Argument of type number is not assignable to parameter of type string.',
	'⚠  4:0   Type for expression one(1, 1) is: number',
	'',
	'1 warning',
	'1 error',
]);

test('tsd failures (not crashes) report only the message', verifyCliFails, 'no-tsd', [], cwd => [
	`The type definition \`index.d.ts\` does not exist at \`${cwd}/index.d.ts\`. Is the path correct? Create one and try again.`,
]);
