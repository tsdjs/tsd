import * as path from 'path';
import {existsSync, readFileSync} from 'fs';
import {
	getDefaultLibFilePath,
	ScriptSnapshot,
	ScriptTarget,
	ModuleResolutionKind,
	flattenDiagnosticMessageText,
	CompilerOptions,
	sys,
	MapLike,
	LanguageServiceHost,
	createLanguageService,
	createDocumentRegistry
} from 'typescript';
import {Diagnostic, Context} from './interfaces';

// List of diagnostic codes that should be ignored
const ignoredDiagnostics = new Set<number>([
	1308 // Support top-level `await`
]);

const loadConfig = () : CompilerOptions => {
	return {
		moduleResolution: ModuleResolutionKind.NodeJs,
		skipLibCheck: true,
		target: ScriptTarget.ES2015
	};
};

/**
 * Create language service host
 *
 * @param rootFileName - The root file
 * @param options - The typescript compiler options
 * @returns LanguageServiceHost
 */
export const createServiceHost = (rootFileName: string, options: CompilerOptions): LanguageServiceHost => {
	const files: MapLike<{ version: number }> = {};
	files[rootFileName] = {version: 0};

	// No need to implement cache because we don't support incremental builds
	return {
		getScriptFileNames: () => [rootFileName],
		getScriptVersion: fileName => files[fileName] && files[fileName].version.toString(),
		getScriptSnapshot: fileName => {
			if (!existsSync(fileName)) {
				return;
			}
			return ScriptSnapshot.fromString(readFileSync(fileName).toString());
		},
		getCurrentDirectory: () => process.cwd(),
		getCompilationSettings: () => options,
		getDefaultLibFileName: defaultLibFileName => getDefaultLibFilePath(defaultLibFileName),
		fileExists: sys.fileExists,
		readFile: sys.readFile,
		readDirectory: sys.readDirectory
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

	const servicesHost = createServiceHost(fileName, compilerOptions);

	// Create the language service files
	const service = createLanguageService(
		servicesHost,
		createDocumentRegistry()
	);

	// Get the relevant diagnostics - this is 3x faster than `getPreEmitDiagnostics`.
	const diagnostics = service.getCompilerOptionsDiagnostics()
	.concat(service.getSyntacticDiagnostics(fileName))
	.concat(service.getSemanticDiagnostics(fileName));

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
