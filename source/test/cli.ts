import path from 'path';
import test from 'ava';
import execa from 'execa';
import readPkgUp from 'read-pkg-up';
import tsd, {formatter} from '..';
import {verifyCli} from './fixtures/utils';

interface ExecaError extends Error {
	readonly exitCode: number;
	readonly stderr: string;
}

test('fail if errors are found', async t => {
	const {exitCode, stderr} = await t.throwsAsync<ExecaError>(execa('../../../cli.js', {
		cwd: path.join(__dirname, 'fixtures/failure')
	}));

	t.is(exitCode, 1);
	verifyCli(t, stderr, [
		'✖  5:19  Argument of type number is not assignable to parameter of type string.',
		'',
		'1 error',
	]);
});

test('succeed if no errors are found', async t => {
	const {exitCode} = await execa('../../../cli.js', {
		cwd: path.join(__dirname, 'fixtures/success')
	});

	t.is(exitCode, 0);
});

test('provide a path', async t => {
	const file = path.join(__dirname, 'fixtures/failure');

	const {exitCode, stderr} = await t.throwsAsync<ExecaError>(execa('dist/cli.js', [file]));

	t.is(exitCode, 1);
	verifyCli(t, stderr, [
		'✖  5:19  Argument of type number is not assignable to parameter of type string.',
		'',
		'1 error',
	]);
});

test('cli help flag', async t => {
	const {exitCode} = await execa('dist/cli.js', ['--help']);

	t.is(exitCode, 0);
});

test('cli version flag', async t => {
	const pkg = readPkgUp.sync({normalize: false})?.packageJson ?? {};

	const {exitCode, stdout} = await execa('dist/cli.js', ['--version']);

	t.is(exitCode, 0);
	t.is(stdout, pkg.version);
});

test('cli typings flag', async t => {
	const runTest = async (arg: '--typings' | '-t') => {
		const {exitCode, stderr} = await t.throwsAsync<ExecaError>(execa('../../../cli.js', [arg, 'utils/index.d.ts'], {
			cwd: path.join(__dirname, 'fixtures/typings-custom-dir')
		}));

		t.is(exitCode, 1);
		verifyCli(t, stderr, [
			'✖  5:19  Argument of type number is not assignable to parameter of type string.',
			'',
			'1 error',
		]);
	};

	await runTest('--typings');
	await runTest('-t');
});

test('cli files flag', async t => {
	const runTest = async (arg: '--files' | '-f') => {
		const {exitCode, stderr} = await t.throwsAsync<ExecaError>(execa('../../../cli.js', [arg, 'unknown.test.ts'], {
			cwd: path.join(__dirname, 'fixtures/specify-test-files')
		}));

		t.is(exitCode, 1);
		verifyCli(t, stderr, [
			'✖  5:19  Argument of type number is not assignable to parameter of type string.',
			'',
			'1 error',
		]);
	};

	await runTest('--files');
	await runTest('-f');
});

test('cli files flag array', async t => {
	const {exitCode, stderr} = await t.throwsAsync<ExecaError>(execa('../../../cli.js', ['--files', 'unknown.test.ts', '--files', 'second.test.ts'], {
		cwd: path.join(__dirname, 'fixtures/specify-test-files')
	}));

	t.is(exitCode, 1);
	verifyCli(t, stderr, [
		'✖  5:19  Argument of type number is not assignable to parameter of type string.',
		'',
		'1 error',
	]);
});

test('cli typings and files flags', async t => {
	const typingsFile = 'dist/test/fixtures/typings-custom-dir/utils/index.d.ts';
	const testFile = 'dist/test/fixtures/typings-custom-dir/index.test-d.ts';

	const {exitCode, stderr} = t.throws<ExecaError>(() => execa.commandSync(`dist/cli.js -t ${typingsFile} -f ${testFile}`));

	t.is(exitCode, 1);
	verifyCli(t, stderr, [
		'✖  5:19  Argument of type number is not assignable to parameter of type string.',
		'',
		'1 error',
	]);
});

test('tsd logs stacktrace on failure', async t => {
	const {exitCode, stderr} = await t.throwsAsync<ExecaError>(execa('../../../cli.js', {
		cwd: path.join(__dirname, 'fixtures/empty-package-json')
	}));

	t.is(exitCode, 1);

	verifyCli(t, stderr, [
		'Error running tsd:',
		'JSONError: Unexpected end of JSON input while parsing empty string',
		'at parseJson (/Users/tommymitchell/src/_open-source/tsd/node_modules/parse-json/index.js:29:21)',
		'at module.exports (/Users/tommymitchell/src/_open-source/tsd/node_modules/read-pkg/index.js:17:15)',
		'at async module.exports (/Users/tommymitchell/src/_open-source/tsd/node_modules/read-pkg-up/index.js:14:16)',
	], {startLine: 0});
});

test('exported formatter matches cli results', async t => {
	const options = {
		cwd: path.join(__dirname, 'fixtures/failure'),
	};

	const {stderr: cliResults} = await t.throwsAsync<ExecaError>(execa('../../../cli.js', options));

	verifyCli(t, cliResults, [
		'✖  5:19  Argument of type number is not assignable to parameter of type string.',
		'',
		'1 error',
	]);

	const tsdResults = await tsd(options);
	const formattedResults = formatter(tsdResults);

	t.true(formattedResults.includes('✖  5:19  Argument of type number is not assignable to parameter of type string.'));
});
