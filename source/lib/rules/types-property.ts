import * as path from 'path';
import * as fs from 'fs';
import {Context, Diagnostic} from '../interfaces';
import {getJSONPropertyPosition} from '../utils';

/**
 * Rule which enforces the use of a `types` property over a `typings` property.
 *
 * @param context - The context object.
 * @returns A list of custom diagnostics.
 */
export default (context: Context): Diagnostic[] => {
	const {pkg} = context;

	if (!pkg.types && pkg.typings) {
		const packageJsonFullPath = path.join(context.cwd, 'package.json');
		const content = fs.readFileSync(packageJsonFullPath, 'utf8');

		return [
			{
				fileName: packageJsonFullPath,
				message: 'Use property `types` instead of `typings`.',
				severity: 'error',
				...getJSONPropertyPosition(content, 'typings')
			}
		];
	}

	return [];
};
