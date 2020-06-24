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
	typingsFile?: string;
}

const checkTypingsFile = async (typings: string, options: Options) => {
	const typingsPath = path.join(options.cwd, typings);
	const typingsExist = await pathExists(typingsPath);

	if (!typingsExist) {
		throw new Error(`The type definition \`${typings}\` does not exist. Create one and try again.`);
	}
};

const findTypingsFile = async (pkg: any, options: Options) => {
	const typings = pkg.types || pkg.typings || 'index.d.ts';

	await checkTypingsFile(typings, options);

	return typings;
};

const findTestFiles = async (typingsFile: string, options: Options & {config: Config}) => {
	const testFile = typingsFile.replace(/\.d\.ts$/, '.test-d.ts');
	const tsxTestFile = typingsFile.replace(/\.d\.ts$/, '.test-d.tsx');
	const testDir = options.config.directory;

	//@ts-ignore
	let testFiles = await globby([testFile, tsxTestFile], {cwd: options.cwd});

	const testDirExists = await pathExists(path.join(options.cwd, testDir));

	if (testFiles.length === 0 && !testDirExists) {
		throw new Error(`The test file \`${testFile}\` or \`${tsxTestFile}\` does not exist. Create one and try again.`);
	}

	if (testFiles.length === 0) {
		//@ts-ignore
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
	let typingsFile = options.typingsFile ? options.typingsFile : '';
	const pkgResult = await readPkgUp({cwd: options.cwd});

	if (!pkgResult) {
		throw new Error('No `package.json` file found. Make sure you are running the command in a Node.js project.');
	}

	const pkg = pkgResult.packageJson;

	const config = loadConfig(pkg as any, options.cwd);

	// Look for a typings file if not explicitly specified, otherwise use `index.d.ts` in the root directory. 
	// If the file is not found, throw an error.
	if (!typingsFile) {
		typingsFile = await findTypingsFile(pkg, options);
	}

	await checkTypingsFile(typingsFile, options);

	const testFiles = await findTestFiles(typingsFile, {
		...options,
		config
	});

	const context: Context = {
		pkg,
		config,
		testFiles,
		typingsFile,
		cwd: options.cwd
	};

	return [
		...getCustomDiagnostics(context),
		...getTSDiagnostics(context)
	];
};
