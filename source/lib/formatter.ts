import * as formatter from 'eslint-formatter-pretty';
import {Diagnostic} from './interfaces';

interface FileWithDiagnostics {
	filePath: string;
	errorCount: number;
	warningCount: number;
	messages: Diagnostic[];
}

/**
 * Format the TypeScript diagnostics to a human readable output.
 *
 * @param diagnostics - List of TypeScript diagnostics.
 * @returns Beautiful diagnostics output
 */
export default (diagnostics: Diagnostic[]): string => {
	const fileMap = new Map<string, FileWithDiagnostics>();

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

	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	return String(formatter([...fileMap.values()]));
};
