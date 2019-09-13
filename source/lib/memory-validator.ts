import * as path from 'path';
import {ProjectSizeStats, Diagnostic, Context} from './interfaces';
import * as pathExists from 'path-exists';
import {writeFileSync, readFileSync} from 'fs';

const statsFilename = '.tsd-memory-check-results.json';

const findStatsFile = async (context: Context) => {
	const rootFileExists = await pathExists(path.join(context.options.cwd, statsFilename));
	if (rootFileExists) {
		return path.join(context.options.cwd, statsFilename);
	}

	const subfolderFileExists = await pathExists(path.join(context.options.cwd, '.tsd', statsFilename));
	if (subfolderFileExists) {
		return path.join(context.options.cwd, '.tsd', statsFilename);
	}

	return;
};

/**
 * Get a list of TypeScript diagnostics, and memory size within the current context.
 *
 * @param context - The context object.
 * @param runStats - An object which has the memory stats from a run.
 * @returns An array of diagnostics
 */
export const verifyMemorySize = async (context: Context, runStats: ProjectSizeStats): Promise<Diagnostic[]> => {
	const existingStatsPath = await findStatsFile(context);

	const writeJSON = (message: string) => {
		const rootFilePath = path.join(context.options.cwd, statsFilename);
		writeFileSync(rootFilePath, JSON.stringify(runStats, null, '  '), 'utf8');
		return [{
			fileName: rootFilePath,
			message,
			severity: 'warning' as 'warning'
		}];
	};

	if (!existingStatsPath) {
		return writeJSON('Recording the stats for memory size in your types');
	}

	if (context.options.writeSnapshot) {
		return writeJSON('Updated the stats for memory size in your types');
	}

	const existingResults = JSON.parse(readFileSync(existingStatsPath, 'utf8')) as ProjectSizeStats;
	const validate = (prev: number, current: number) => {
		const largerPrev = (prev / 100) * (context.options.sizeDelta + 100);
		return current < largerPrev;
	};

	const names: string[] = [];

	// This is an approximation, and would likely change between versions, so the number is
	// conservative
	const typescriptTypes = 8500;

	if (!validate(existingResults.typeCount - typescriptTypes, runStats.typeCount - typescriptTypes)) {
		names.push(`- Type Count raised by ${runStats.typeCount - existingResults.typeCount}`);
	}

	if (!validate(existingResults.memoryUsage, runStats.memoryUsage)) {
		names.push(`- Memory usage raised by ${runStats.typeCount / existingResults.typeCount * 100}%`);
	}

	if (names.length) {
		const messages = [
			'Failed due to memory changes for types being raised. Higher numbers',
			'can slow down the editor experience for consumers.',
			'If you\'d like to update the fixtures to keep these changes re-run tsd with --write',
			'', ...names];

		return [{
			fileName: existingStatsPath,
			message: messages.join('\n           '),
			severity: 'error' as 'error'
		}];
	}

	return [];
};
