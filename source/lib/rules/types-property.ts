import path from 'node:path';
import fs from 'node:fs/promises';
import type {Context, Diagnostic} from '../interfaces.js';
import {getJsonPropertyPosition} from '../utils/index.js';

/**
 * Rule which enforces the use of a `types` property over a `typings` property.
 *
 * @param context - The context object.
 * @returns A list of custom diagnostics.
 */
const typesProperty = async (context: Context): Promise<Diagnostic[]> => {
	const {pkg} = context;

	if (!pkg.types && pkg.typings) {
		const packageJsonFullPath = path.join(context.cwd, 'package.json');
		const content = await fs.readFile(packageJsonFullPath, 'utf8');

		return [
			{
				fileName: packageJsonFullPath,
				message: 'Use property `types` instead of `typings`.',
				severity: 'error',
				...getJsonPropertyPosition(content, 'typings'),
			},
		];
	}

	return [];
};

export default typesProperty;
