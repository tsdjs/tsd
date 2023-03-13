import fs from 'node:fs';
import path from 'node:path';
import test from 'ava';
import execa from 'execa';
import readPkgUp from 'read-pkg-up';

interface ExecaError extends Error {
	readonly exitCode: number;
	readonly stderr: string;
}

test('fail if errors are found', async t => {
	const {exitCode, stderr} = await t.throwsAsync<ExecaError>(execa('../../../cli.js', {
		cwd: path.join(__dirname, 'fixtures/failure')
	}));

	t.is(exitCode, 1);
	t.true(stderr.includes('✖  5:19  Argument of type number is not assignable to parameter of type string.'));
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
	t.true(stderr.includes('✖  5:19  Argument of type number is not assignable to parameter of type string.'));
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
		const {exitCode, stderr} = await t.throwsAsync<ExecaError>(
			execa('../../../cli.js', [arg, 'utils/index.d.ts'], {
				cwd: path.join(__dirname, 'fixtures/typings-custom-dir')
			})
		);

		t.is(exitCode, 1);
		t.true(stderr.includes('✖  5:19  Argument of type number is not assignable to parameter of type string.'));
	};

	await runTest('--typings');
	await runTest('-t');
});

test('cli files flag', async t => {
	const runTest = async (arg: '--files' | '-f') => {
		const {exitCode, stderr} = await t.throwsAsync<ExecaError>(
			execa('../../../cli.js', [arg, 'unknown.test.ts'], {
				cwd: path.join(__dirname, 'fixtures/specify-test-files')
			})
		);

		t.is(exitCode, 1);
		t.true(stderr.includes('✖  5:19  Argument of type number is not assignable to parameter of type string.'));
	};

	await runTest('--files');
	await runTest('-f');
});

test('cli files flag array', async t => {
	const {exitCode, stderr} = await t.throwsAsync<ExecaError>(
		execa('../../../cli.js', ['--files', 'unknown.test.ts', '--files', 'second.test.ts'], {
			cwd: path.join(__dirname, 'fixtures/specify-test-files')
		})
	);

	t.is(exitCode, 1);
	t.true(stderr.includes('✖  5:19  Argument of type number is not assignable to parameter of type string.'));
});

test('cli typings and files flags', async t => {
	const typingsFile = 'dist/test/fixtures/typings-custom-dir/utils/index.d.ts';
	const testFile = 'dist/test/fixtures/typings-custom-dir/index.test-d.ts';

	const {exitCode, stderr} = t.throws<ExecaError>(() => execa.commandSync(`dist/cli.js -t ${typingsFile} -f ${testFile}`));

	t.is(exitCode, 1);
	t.true(stderr.includes('✖  5:19  Argument of type number is not assignable to parameter of type string.'));
});

test('tsd logs stacktrace on failure', async t => {
	const {exitCode, stderr, stack} = await t.throwsAsync<ExecaError>(execa('../../../cli.js', {
		cwd: path.join(__dirname, 'fixtures/empty-package-json')
	}));

	t.is(exitCode, 1);
	t.true(stderr.includes('Error running tsd: JSONError: Unexpected end of JSON input while parsing empty string'));
	t.truthy(stack);
});

test('pass string files', async t => {
	const source = await fs.promises.readFile(path.join(__dirname, 'fixtures/specify-test-files/syntax.test.ts'), 'utf8');
	const {exitCode, stderr} = await t.throwsAsync<ExecaError>(
		execa('../../../cli.js', ['--files', `syntax.test.ts:${source}`], {
			cwd: path.join(__dirname, 'fixtures/specify-test-files')
		})
	);

	t.is(exitCode, 1);
	t.true(stderr.includes('✖  1:6  Type string is not assignable to type number.'));
});

test('pass string files with globs', async t => {
	const source = await fs.promises.readFile(path.join(__dirname, 'fixtures/specify-test-files/syntax.test.ts'), 'utf8');
	const {exitCode, stderr} = await t.throwsAsync<ExecaError>(
		execa('../../../cli.js', ['--files', 'unknown.test.ts', '--files', 'second.test.ts', '--files', `syntax.test.ts:${source}`], {
			cwd: path.join(__dirname, 'fixtures/specify-test-files')
		})
	);

	const expectedLines = [
		'unknown.test.ts:5:19',
		'✖  5:19  Argument of type number is not assignable to parameter of type string.',
		'',
		'syntax.test.ts:1:6',
		'✖  1:6   Type string is not assignable to type number.',
		'',
		'2 errors',
	];

	// Grab output only and skip stack trace
	const receivedLines = stderr.trim().split('\n').slice(1, 1 + expectedLines.length).map(line => line.trim());

	t.is(exitCode, 1);
	t.deepEqual(receivedLines, expectedLines);
});
