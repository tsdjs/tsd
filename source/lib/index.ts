import path from 'node:path';
import process from 'node:process';
import {readPackageUp} from 'read-pkg-up';
import {pathExists} from 'path-exists';
import {globby} from 'globby';
import {getDiagnostics as getTSDiagnostics} from './compiler.js';
import loadConfig from './config.js';
import getCustomDiagnostics from './rules/index.js';
import {type Context, type Config, type Diagnostic, type PackageJsonWithTsdConfig, TsdError} from './interfaces.js';

export type Options = {
	cwd: string;
	typingsFile?: string;
	testFiles?: readonly string[];
};

const findTypingsFile = async (pkg: PackageJsonWithTsdConfig, options: Options): Promise<string> => {
	/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
	const typings = options.typingsFile
		|| pkg.types
		|| pkg.typings
		|| (pkg.main && path.parse(pkg.main).name + '.d.ts')
		|| 'index.d.ts';
	/* eslint-enable @typescript-eslint/prefer-nullish-coalescing */

	const typingsPath = path.join(options.cwd, typings);
	const typingsExist = await pathExists(typingsPath);

	if (!typingsExist) {
		throw new TsdError(`The type definition \`${typings}\` does not exist at \`${typingsPath}\`. Is the path correct? Create one and try again.`);
	}

	return typings;
};

const normalizeTypingsFilePath = (typingsFilePath: string, options: Options) => {
	if (options.typingsFile) {
		return path.basename(typingsFilePath);
	}

	return typingsFilePath;
};

const findCustomTestFiles = async (testFilesPattern: readonly string[], cwd: string) => {
	const testFiles = await globby(testFilesPattern, {cwd});

	if (testFiles.length === 0) {
		throw new TsdError('Could not find any test files with the given pattern(s). Create one and try again.');
	}

	return testFiles.map(file => path.join(cwd, file));
};

const findTestFiles = async (typingsFilePath: string, options: Options & {config: Config}) => {
	if (options.testFiles?.length) {
		return findCustomTestFiles(options.testFiles, options.cwd);
	}

	// Return only the filename if the `typingsFile` option is used.
	const typingsFile = normalizeTypingsFilePath(typingsFilePath, options);

	const testFile = typingsFile.replace(/\.d\.ts$/, '.test-d.ts');
	const tsxTestFile = typingsFile.replace(/\.d\.ts$/, '.test-d.tsx');
	const testDir = options.config.directory;

	let testFiles = await globby([testFile, tsxTestFile], {cwd: options.cwd});
	const testDirExists = await pathExists(path.join(options.cwd, testDir));

	if (testFiles.length === 0 && !testDirExists) {
		throw new TsdError(`The test file \`${testFile}\` or \`${tsxTestFile}\` does not exist in \`${options.cwd}\`. Create one and try again.`);
	}

	if (testFiles.length === 0) {
		testFiles = await globby([`${testDir}/**/*.ts`, `${testDir}/**/*.tsx`], {cwd: options.cwd});
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
	const pkgResult = await readPackageUp({cwd: options.cwd});

	if (!pkgResult) {
		throw new TsdError(`No \`package.json\` file found in \`${options.cwd}\`. Make sure you are running the command in a Node.js project.`);
	}

	const pkg = pkgResult.packageJson as PackageJsonWithTsdConfig;
	const config = loadConfig(pkg, options.cwd);

	// Look for a typings file, otherwise use `index.d.ts` in the root directory. If the file is not found, throw an error.
	const typingsFile = await findTypingsFile(pkg, options);

	const testFiles = await findTestFiles(typingsFile, {
		...options,
		config,
	});

	const context: Context = {
		cwd: options.cwd,
		pkg,
		typingsFile,
		testFiles,
		config,
	};

	return [
		...await getCustomDiagnostics(context),
		...getTSDiagnostics(context),
	];
};

export default tsd;
