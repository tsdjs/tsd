import formatter from 'eslint-formatter-pretty';
import {Diagnostic} from './interfaces';
import {diffStringsUnified} from 'jest-diff';

interface FileWithDiagnostics {
	filePath: string;
	errorCount: number;
	warningCount: number;
	messages: Diagnostic[];
	diff?: {
		expected: string;
		received: string;
	};
}

/**
 * Format the TypeScript diagnostics to a human readable output.
 *
 * @param diagnostics - List of TypeScript diagnostics.
 * @returns Beautiful diagnostics output
 */
export default (diagnostics: Diagnostic[], showDiff = false): string => {
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

		if (showDiff && diagnostic.diff) {
			let difference = diffStringsUnified(
				diagnostic.diff.expected.replace(/'/g, '\'\''),
				diagnostic.diff.received.replace(/'/g, '\'\''),
				{omitAnnotationLines: true}
			);

			if (difference) {
				difference = difference.split('\n').map(line => `  ${line}`).join('\n');
				diagnostic.message = `${diagnostic.message}\n\n${difference}`;
			}
		}
	}

	return String(formatter([...fileMap.values()]));
};
