import path from 'path';
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
	t.regex(stderr, /5:19[ ]{2}Argument of type number is not assignable to parameter of type string./);
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
	t.regex(stderr, /5:19[ ]{2}Argument of type number is not assignable to parameter of type string./);
});

test('cli help flag', async t => {
	const runTest = (arg: '--help' | '-h') => {
		const {exitCode} = execa.commandSync(`dist/cli.js ${arg}`);

		t.is(exitCode, 0);
	};

	runTest('--help');
	runTest('-h');
});

test('cli version flag', async t => {
	const pkg = readPkgUp.sync({normalize: false})?.packageJson ?? {};

	const runTest = (arg: '--version' | '-v') => {
		const {exitCode, stdout} = execa.commandSync(`dist/cli.js ${arg}`);

		t.is(exitCode, 0);
		t.is(stdout, pkg.version);
	};

	runTest('--version');
	runTest('-v');
});
