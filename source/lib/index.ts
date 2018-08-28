import * as path from 'path';
import * as readPkgUp from 'read-pkg-up';
import * as pathExists from 'path-exists';
import {getDiagnostics} from './compiler';

interface Options {
	cwd: string;
}

const findTypingsFile = async (pkg: any, options: Options) => {
	const typings = pkg.typings || 'index.d.ts';

	const typingsExist = await pathExists(path.join(options.cwd, typings));

	if (!typingsExist) {
		throw new Error(`The type definition \`${typings}\` does not exist. Create one and try again.`);
	}

	return typings;
};

const findTestFile = async (typingsFile: string, options: Options) => {
	const testFile = typingsFile.replace(/\.d\.ts$/, '.test-d.ts');

	const testFileExists = await pathExists(path.join(options.cwd, testFile));

	if (!testFileExists) {
		throw new Error(`The test file \`${testFile}\` does not exist. Create one and try again.`);
	}

	return testFile;
};

/**
 * Type check the type definition of the project.
 *
 * @returns A promise which resolves the diagnostics of the type definition.
 */
export default async (options: Options = {cwd: process.cwd()}) => {
	const {pkg} = await readPkgUp({cwd: options.cwd});

	if (!pkg) {
		throw new Error('No `package.json` file found. Make sure you are running the command in a Node.js project.');
	}

	// Look for a typings file, otherwise use `index.d.ts` in the root directory. If the file is not found, throw an error.
	const typingsFile = await findTypingsFile(pkg, options);

	const testFile = await findTestFile(typingsFile, options);

	return getDiagnostics(path.join(options.cwd, testFile));
};
