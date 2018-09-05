import * as path from 'path';
import {createProgram, getPreEmitDiagnostics, ScriptTarget, ModuleResolutionKind, flattenDiagnosticMessageText} from 'typescript';
import {Diagnostic, Context} from './interfaces';

// List of diagnostic codes that should be ignored
const ignoredDiagnostics = new Set<number>([
	1308 // Support top-level `await`
]);

const loadConfig = () => {
	return {
		moduleResolution: ModuleResolutionKind.NodeJs,
		target: ScriptTarget.ES2015
	};
};

/**
 * Get a list of TypeScript diagnostics within the current context.
 *
 * @param context - The context object.
 * @returns List of diagnostics
 */
export const getDiagnostics = (context: Context): Diagnostic[] => {
	const compilerOptions = loadConfig();

	const fileName = path.join(context.cwd, context.testFile);

	const program = createProgram([fileName], compilerOptions);

	// Retrieve the TypeScript compiler diagnostics
	const diagnostics = getPreEmitDiagnostics(program);

	const result: Diagnostic[] = [];

	for (const diagnostic of diagnostics) {
		if (!diagnostic.file || ignoredDiagnostics.has(diagnostic.code)) {
			continue;
		}

		const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start as number);

		result.push({
			fileName: diagnostic.file.fileName,
			message: flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
			severity: 'error',
			line: position.line + 1,
			column: position.character
		});
	}

	return result;
};
