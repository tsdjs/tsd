import * as path from 'path';
import * as readPkgUp from 'read-pkg-up';
import * as pathExists from 'path-exists';
import globby from 'globby';
import {getTypeScriptResults as getTSDiagnostics} from './compiler';
import loadConfig from './config';
import getCustomDiagnostics from './rules';
import {Context, Config, Options} from './interfaces';
import {verifyMemorySize} from './memory-validator';

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
	const testDir = options.config.directory;

	const testFileExists = await pathExists(path.join(options.cwd, testFile));
	const testDirExists = await pathExists(path.join(options.cwd, testDir));

	if (!testFileExists && !testDirExists) {
		throw new Error(`The test file \`${testFile}\` does not exist. Create one and try again.`);
	}

	let testFiles = [testFile];

	if (!testFileExists) {
		testFiles = await globby(`${testDir}/**/*.ts`, {cwd: options.cwd});
	}

	return testFiles;
};

// The default options if you were to run tsd on its own
const defaultOptions: Options = {
	cwd: process.cwd(),
	verify: false,
	writeSnapshot: false,
	sizeDelta: 10
};

/**
 * Type check the type definition of the project.
 *
 * @returns A promise which resolves the run results with diagnostics and stats for the type definitions.
 */
export default async (inputOptions: Partial<Options> = defaultOptions) => {
	const options = {...defaultOptions, ...inputOptions};
	const {pkg} = await readPkgUp({cwd: options.cwd});

	if (!pkg) {
		throw new Error('No `package.json` file found. Make sure you are running the command in a Node.js project.');
	}

	const config = loadConfig(pkg, options.cwd);

	// Look for a typings file, otherwise use `index.d.ts` in the root directory. If the file is not found, throw an error.
	const typingsFile = await findTypingsFile(pkg, options);

	const testFiles = await findTestFiles(typingsFile, {
		...options,
		config
	});

	const context: Context = {
		options,
		pkg,
		typingsFile,
		testFiles,
		config,
	};

	const tsResults = getTSDiagnostics(context);

	return [
		...getCustomDiagnostics(context),
		...tsResults.diagnostics,
		...await verifyMemorySize(context, tsResults.stats)
	];
};
