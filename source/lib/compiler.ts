import {createProgram, getPreEmitDiagnostics, ScriptTarget, ModuleResolutionKind} from 'typescript';

const loadConfig = () => {
	return {
		moduleResolution: ModuleResolutionKind.NodeJs,
		target: ScriptTarget.ES2015
	};
};

/**
 * Get a list of diagnostics for the given file.
 *
 * @param fileName - Name of the file run the diagnosis on.
 * @returns List of diagnostics
 */
export const getDiagnostics = (fileName: string) => {
	const compilerOptions = loadConfig();

	const program = createProgram([fileName], compilerOptions);

	return getPreEmitDiagnostics(program);
};
