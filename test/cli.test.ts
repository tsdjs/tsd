import path from 'path';
import {expect, test} from 'vitest';
import readPkgUp from 'read-pkg-up';
import execa, { type ExecaError } from 'execa';
import { throwsAsync } from './fixtures/throws-async';
import { CLI_PATH, FIXTURES_PATH } from './fixtures/constants';

test.concurrent('fail if errors are found', async () => {
	const {exitCode, stderr} = await throwsAsync<ExecaError>(execa(CLI_PATH, {
		cwd: path.join(FIXTURES_PATH, 'failure')
	}));

	expect(exitCode).toBe(1);
	expect(stderr).toMatch('5:19  Argument of type number is not assignable to parameter of type string.');
});

test.concurrent('succeed if no errors are found', async () => {
	const {exitCode} = await execa(CLI_PATH, {
		cwd: path.join(FIXTURES_PATH, 'success')
	});

	expect(exitCode).toBe(0);
});

test.concurrent('provide a path', async () => {
	const file = path.join(FIXTURES_PATH, 'failure');

	const {exitCode, stderr} = await throwsAsync<ExecaError>(execa('dist/cli.js', [file]));

	expect(exitCode).toBe(1);
	expect(stderr).toMatch('5:19  Argument of type number is not assignable to parameter of type string.');
});

test.concurrent('cli help flag', async () => {
	const {exitCode} = await execa('dist/cli.js', ['--help']);

	expect(exitCode).toBe(0);
});

test.concurrent('cli version flag', async () => {
	const pkg = readPkgUp.sync({normalize: false})?.packageJson ?? {};

	const {exitCode, stdout} = await execa('dist/cli.js', ['--version']);

	expect(exitCode).toBe(0);
	expect(stdout).toBe(pkg.version);
});

test.concurrent('cli typings flag', async () => {
	const runTest = async (arg: '--typings' | '-t') => {
		const {exitCode, stderr} = await throwsAsync<ExecaError>(execa(CLI_PATH, [arg, 'utils/index.d.ts'], {
			cwd: path.join(FIXTURES_PATH, 'typings-custom-dir')
		}));

		expect(exitCode).toBe(1);
		expect(stderr).toMatch('✖  5:19  Argument of type number is not assignable to parameter of type string.');
	};

	await runTest('--typings');
	await runTest('-t');
});

test.concurrent('cli files flag', async () => {
	const runTest = async (arg: '--files' | '-f') => {
		const {exitCode, stderr} = await throwsAsync<ExecaError>(execa(CLI_PATH, [arg, 'unknown.test.ts'], {
			cwd: path.join(FIXTURES_PATH, 'specify-test-files')
		}));

		expect(exitCode).toBe(1);
		expect(stderr).toMatch('✖  5:19  Argument of type number is not assignable to parameter of type string.');
	};

	await runTest('--files');
	await runTest('-f');
});

test.concurrent('cli files flag array', async () => {
	const {exitCode, stderr} = await throwsAsync<ExecaError>(execa(CLI_PATH, ['--files', 'unknown.test.ts', '--files', 'second.test.ts'], {
		cwd: path.join(FIXTURES_PATH, 'specify-test-files')
	}));

	expect(exitCode).toBe(1);
	expect(stderr).toMatch('✖  5:19  Argument of type number is not assignable to parameter of type string.');
});

test.concurrent('cli typings and files flags', async () => {
	const typingsFile = 'dist/test/fixtures/typings-custom-dir/utils/index.d.ts';
	const testFile = 'dist/test/fixtures/typings-custom-dir/index.test-d.ts';

	const {exitCode, stderr} = await throwsAsync<ExecaError>(execa.command(`${CLI_PATH} -t ${typingsFile} -f ${testFile}`));

	expect(exitCode).toBe(1);
	expect(stderr).toMatch('✖  5:19  Argument of type number is not assignable to parameter of type string.');
});

test.concurrent('tsd logs stacktrace on failure', async () => {
	const {exitCode, stderr, stack} = await throwsAsync<ExecaError>(execa(CLI_PATH, {
		cwd: path.join(FIXTURES_PATH, 'empty-package-json')
	}));

	expect(exitCode).toBe(1);
	expect(stderr).toMatch('Error running tsd: JSONError: Unexpected end of JSON input while parsing empty string');
	expect(stack).toBeDefined();
});
