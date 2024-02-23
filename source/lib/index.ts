import path from 'node:path';
import process from 'node:process';
import {readPackageUp} from 'read-package-up';
import {pathExists} from 'path-exists';
import {globby} from 'globby';
import {getDiagnostics as getTSDiagnostics} from './compiler.js';
import loadConfig from './config.js';
import getCustomDiagnostics from './rules/index.js';
import {
	TsdError,
	type Context,
	type Config,
	type Diagnostic,
	type PackageJsonWithTsdConfig,
} from './interfaces.js';

export type Options = {
	cwd: string;
	testFiles?: readonly string[];
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const TS_EXTENSIONS = ['ts', 'cts', 'mts', 'tsx', 'ctsx', 'mtsx'];

const findCustomTestFiles = async (testFilesPattern: readonly string[], cwd: string) => {
	const testFiles = await globby(testFilesPattern, {cwd});

	if (testFiles.length === 0) {
		throw new TsdError('Could not find any test files with the given pattern(s).');
	}

	return testFiles.map(file => path.join(cwd, file));
};

const findTestFiles = async (options: Options & {config: Config}) => {
	if (options.testFiles?.length) {
		return findCustomTestFiles(options.testFiles, options.cwd);
	}

	const cwdGlobs = TS_EXTENSIONS.map(extension => `**/*.test-d.${extension}`);
	const testDirectory = options.config.directory;

	let testFiles = await globby(cwdGlobs, {cwd: options.cwd});
	const testDirectoryExists = await pathExists(path.join(options.cwd, testDirectory));

	if (testFiles.length === 0 && !testDirectoryExists) {
		throw new TsdError(`No test files were found in \`${options.cwd}\` or in any of its subdirectories.`);
	}

	if (testFiles.length === 0) {
		const testDirectoryGlobs = TS_EXTENSIONS.map(extension => `${testDirectory}/**/*.${extension}`);
		testFiles = await globby(testDirectoryGlobs, {cwd: options.cwd});
	}

	return testFiles.map(fileName => path.join(options.cwd, fileName));
};

/**
 * Type check the type definition of the project.
 *
 * @returns A promise which resolves the diagnostics of the type definition.
 */
// eslint-disable-next-line unicorn/no-object-as-default-parameter
const tsd = async (options: Options = {cwd: process.cwd()}): Promise<Diagnostic[]> => {
	const packageResult = await readPackageUp({cwd: options.cwd});

	if (!packageResult) {
		throw new TsdError(`No \`package.json\` file found in \`${options.cwd}\`. Make sure you are running the command in a Node.js project.`);
	}

	const package_ = packageResult.packageJson as PackageJsonWithTsdConfig;
	const config = loadConfig(package_, options.cwd);

	const testFiles = await findTestFiles({
		...options,
		config,
	});

	const context: Context = {
		cwd: options.cwd,
		pkg: package_,
		testFiles,
		config,
	};

	return [
		...await getCustomDiagnostics(context),
		...getTSDiagnostics(context),
	];
};

export default tsd;
