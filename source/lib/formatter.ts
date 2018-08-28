import {flattenDiagnosticMessageText, Diagnostic} from 'typescript';
import * as formatter from 'eslint-formatter-pretty';

/**
 * Format the TypeScript diagnostics to a human readable output.
 *
 * @param diagnostics - List of TypeScript diagnostics.
 * @returns Beautiful diagnostics output
 */
export default (diagnostics: Diagnostic[]) => {
	const fileMap = new Map<string>();

	for (const diagnostic of diagnostics) {
		if (!diagnostic.file) {
			continue;
		}

		let entry = fileMap.get(diagnostic.file.fileName);

		if (!entry) {
			entry = {
				filePath: diagnostic.file.fileName,
				errorCount: 0,
				warningCount: 0,
				messages: []
			};

			fileMap.set(diagnostic.file.fileName, entry);
		}

		const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start as number);

		entry.errorCount++;
		entry.messages.push({
			message: flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
			severity: 'error',
			line: position.line + 1,
			column: position.character
		});
	}

	return formatter(Array.from(fileMap.values()));
};
