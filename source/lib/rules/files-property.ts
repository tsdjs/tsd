import * as path from 'path';
import * as fs from 'fs';
import * as globby from 'globby';
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

	const packageFiles = pkg.files;
	if (!Array.isArray(packageFiles)) {
		return [];
	}

	const normalizedTypingsFile = path.normalize(typingsFile);

	const patternProcessedPackageFiles = processGitIgnoreStylePatterns(packageFiles);
	const normalizedFiles = globby.sync(patternProcessedPackageFiles, {cwd: context.cwd}).map(path.normalize);

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
			...getJSONPropertyPosition(content, 'files')
		}
	];
};

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
				negationMarkersCount % 2 === 0
			] as const;
		})
		// Only include pattern if it has an even count of negation markers
		.filter(([, hasEvenCountOfNegationMarkers]) => hasEvenCountOfNegationMarkers)
		.map(([processedPattern]) => processedPattern);

	return [...new Set(processedPatterns)];
}
