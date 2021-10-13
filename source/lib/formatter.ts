import formatter from 'eslint-formatter-pretty';
import {Diagnostic, ExtendedDiagnostic} from './interfaces';

interface FileWithDiagnostics {
	filePath: string;
	errorCount: number;
	warningCount: number;
	messages: Diagnostic[];
}

/**
 * Format the TypeScript diagnostics to a human readable output.
 *
 * @param extendedDiagnostics - Object containing list of TypeScript diagnostics and test count.
 * @returns Beautiful diagnostics output
 */
export default (extendedDiagnostics: ExtendedDiagnostic) => {
	const {diagnostics} = extendedDiagnostics;
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

	return String(formatter([...fileMap.values()]));
};
