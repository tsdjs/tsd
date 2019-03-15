import * as path from 'path';
import * as fs from 'fs';
import {Context, Diagnostic} from '../interfaces';
import {getJSONPropertyPosition} from '../utils';

/**
 * Rule which enforces the typings file to be present in the `files` list in `package.json`.
 *
 * @param context - The context object.
 * @returns A list of custom diagnostics.
 */
export default (context: Context): Diagnostic[] => {
	const {pkg, typingsFile} = context;

	if (!Array.isArray(pkg.files)) {
		return [];
	}

	const normalizedTypingsFile = path.normalize(typingsFile);
	const normalizedFiles = (pkg.files as string[]).map(path.normalize);

	if (normalizedFiles.includes(normalizedTypingsFile)) {
		return [];
	}

	const content = fs.readFileSync(path.join(context.cwd, 'package.json'), 'utf8');

	return [
		{
			fileName: 'package.json',
			message: `TypeScript type definition \`${normalizedTypingsFile}\` is not part of the \`files\` list.`,
			severity: 'error',
			...getJSONPropertyPosition(content, 'files')
		}
	];
};
