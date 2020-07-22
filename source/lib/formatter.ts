import * as formatter from 'eslint-formatter-pretty';
import {ExtendedDiagnostic} from './interfaces';

/**
 * Format the TypeScript diagnostics to a human readable output.
 *
 * @param diagnostics - List of TypeScript diagnostics.
 * @returns Beautiful diagnostics output
 */
export default (extendedDiagnostics: ExtendedDiagnostic) => {
	const diagnostics = extendedDiagnostics.diagnostics;
	const fileMap = new Map<string, any>();

	for (const diagnostic of diagnostics) {
		let entry = fileMap.get(diagnostic.fileName);

		if (!entry) {
			entry = {
				filePath: diagnostic.fileName,
				errorCount: 0,
				warningCount: 0,
				messages: []
			};

			fileMap.set(diagnostic.fileName, entry);
		}

		entry.errorCount++;
		entry.messages.push(diagnostic);
	}

	return formatter(Array.from(fileMap.values()));
};
