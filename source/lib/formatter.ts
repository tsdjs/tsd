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
 * @param showDiff - Display difference between expected and received types.
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

		if (showDiff && diagnostic.diff) {
			let difference = diffStringsUnified(
				diagnostic.diff.expected,
				diagnostic.diff.received,
				{omitAnnotationLines: true}
			);

			if (difference) {
				difference = difference.split('\n').map(line => `  ${line}`).join('\n');
				diagnostic.message = `${diagnostic.message}\n\n${difference}`;
			}
		}

		if (diagnostic.severity === 'error') {
			entry.errorCount++;
		} else if (diagnostic.severity === 'warning') {
			entry.warningCount++;
		}

		entry.messages.push(diagnostic);
	}

	return String(formatter([...fileMap.values()]));
};
