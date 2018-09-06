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
	const typingsFileName = path.basename(typingsFile);

	if (!Array.isArray(pkg.files) || pkg.files.indexOf(typingsFileName) !== -1) {
		return [];
	}

	const content = fs.readFileSync(path.join(context.cwd, 'package.json'), 'utf8');

	return [
		{
			fileName: 'package.json',
			message: `TypeScript type definition \`${typingsFileName}\` is not part of the \`files\` list.`,
			severity: 'error',
			...getJSONPropertyPosition(content, 'files')
		}
	];
};
