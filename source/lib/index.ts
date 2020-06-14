import * as path from 'path';
import * as readPkgUp from 'read-pkg-up';
import * as pathExists from 'path-exists';
import * as globby from 'globby';
import {getDiagnostics as getTSDiagnostics} from './compiler';
import loadConfig from './config';
import getCustomDiagnostics from './rules';
import {Context, Config} from './interfaces';

export interface Options {
	cwd: string;
}

const findTypingsFile = async (pkg: any, options: Options) => {
	const typings = pkg.types || pkg.typings || 'index.d.ts';

	const typingsExist = await pathExists(path.join(options.cwd, typings));

	if (!typingsExist) {
		throw new Error(`The type definition \`${typings}\` does not exist. Create one and try again.`);
	}

	return typings;
};

const findTestFiles = async (typingsFile: string, options: Options & {config: Config}) => {
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

	return testFiles;
};

/**
 * Type check the type definition of the project.
 *
 * @returns A promise which resolves the diagnostics of the type definition.
 */
export default async (options: Options = {cwd: process.cwd()}) => {
	const pkgResult = await readPkgUp({cwd: options.cwd});

	if (!pkgResult) {
		throw new Error('No `package.json` file found. Make sure you are running the command in a Node.js project.');
	}

	const pkg = pkgResult.packageJson;

	const config = loadConfig(pkg as any, options.cwd);

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

	return [
		...getCustomDiagnostics(context),
		...getTSDiagnostics(context)
	];
};
