import path from 'path';
import readPkgUp from 'read-pkg-up';
import pathExists from 'path-exists';
import globby from 'globby';
import {getDiagnostics as getTSDiagnostics} from './compiler';
import loadConfig from './config';
import getCustomDiagnostics from './rules';
import {Config, Context, ExtendedDiagnostic, PackageJsonWithTsdConfig} from './interfaces';

export interface Options {
	cwd: string;
	typingsFile?: string;
	testFiles?: readonly string[];
}

const findTypingsFile = async (pkg: PackageJsonWithTsdConfig, options: Options): Promise<string> => {
	const typings =
		options.typingsFile ||
		pkg.types ||
		pkg.typings ||
		(pkg.main && path.parse(pkg.main).name + '.d.ts') ||
		'index.d.ts';
	const typingsExist = await pathExists(path.join(options.cwd, typings));

	if (!typingsExist) {
		throw new Error(`The type definition \`${typings}\` does not exist. Create one and try again.`);
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
		throw new Error('Could not find any test files. Create one and try again');
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
		throw new Error(`The test file \`${testFile}\` or \`${tsxTestFile}\` does not exist. Create one and try again.`);
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
export default async (options: Options = {cwd: process.cwd()}): Promise<ExtendedDiagnostic> => {
	const pkgResult = await readPkgUp({cwd: options.cwd});

	if (!pkgResult) {
		throw new Error('No `package.json` file found. Make sure you are running the command in a Node.js project.');
	}

	const pkg = pkgResult.packageJson as PackageJsonWithTsdConfig;
	const config = loadConfig(pkg, options.cwd);

	// Look for a typings file, otherwise use `index.d.ts` in the root directory. If the file is not found, throw an error.
	const typingsFile = await findTypingsFile(pkg, options);

	const testFiles = await findTestFiles(typingsFile, {
		...options,
		config
	});

	const context: Context = {
		cwd: options.cwd,
		pkg,
		typingsFile,
		testFiles,
		config
	};

	const {diagnostics: tsDiagnostics, testCount} = getTSDiagnostics(context);
	const customDiagnostics = getCustomDiagnostics(context);

	return {
		testCount,
		diagnostics: [
			...customDiagnostics,
			...tsDiagnostics
		]
	};
};
