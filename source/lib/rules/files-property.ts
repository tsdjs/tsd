import path from 'node:path';
import fs from 'node:fs';
import pMap from 'p-map';
import {globby} from 'globby';
import type {Context, Diagnostic} from '../interfaces.js';
import {getJsonPropertyPosition} from '../utils/index.js';

/**
 * Rule which enforces the typings file to be present in the `files` list in `package.json`.
 *
 * @param context - The context object.
 * @returns A list of custom diagnostics.
 */
const filesProperty = async (context: Context): Promise<Diagnostic[]> => {
	const {pkg, typingsFile} = context;

	const packageFiles = pkg.files;
	if (!Array.isArray(packageFiles)) {
		return [];
	}

	const normalizedTypingsFile = path.normalize(typingsFile);

	const patternProcessedPackageFiles = processGitIgnoreStylePatterns(packageFiles);
	const normalizedFiles = await pMap(
		await globby(patternProcessedPackageFiles, {cwd: context.cwd}),
		glob => path.normalize(glob),
	);

	if (normalizedFiles.includes(normalizedTypingsFile)) {
		return [];
	}

	const packageJsonFullPath = path.join(context.cwd, 'package.json');
	const content = fs.readFileSync(packageJsonFullPath, 'utf8');

	return [
		{
			fileName: packageJsonFullPath,
			message: `TypeScript type definition \`${normalizedTypingsFile}\` is not part of the \`files\` list.`,
			severity: 'error',
			...getJsonPropertyPosition(content, 'files'),
		},
	];
};

export default filesProperty;

function processGitIgnoreStylePatterns(patterns: readonly string[]): string[] {
	const processedPatterns = patterns
		.map(pattern => {
			const [negatePatternMatch] = /^!+/.exec(pattern) ?? [];
			const negationMarkersCount = negatePatternMatch ? negatePatternMatch.length : 0;

			return [
				pattern
					.slice(negationMarkersCount)
					// Strip off `/` from the start of the pattern
					.replace(/^\/+/, ''),
				negationMarkersCount % 2 === 0,
			] as const;
		})
		// Only include pattern if it has an even count of negation markers
		.filter(([, hasEvenCountOfNegationMarkers]) => hasEvenCountOfNegationMarkers)
		.map(([processedPattern]) => processedPattern);

	return [...new Set(processedPatterns)];
}
