import * as path from 'path';
import * as pkgConf from 'pkg-conf';
import {
	ScriptTarget,
	ModuleResolutionKind,
	flattenDiagnosticMessageText,
	CompilerOptions,
	createProgram,
	JsxEmit,
	SyntaxKind,
	SourceFile,
	Diagnostic as TSDiagnostic
} from 'typescript';
import {Diagnostic, DiagnosticCode, Context, Position} from './interfaces';

// List of diagnostic codes that should be ignored
const ignoredDiagnostics = new Set<number>([
	DiagnosticCode.AwaitIsOnlyAllowedInAsyncFunction
]);

const loadConfig = (cwd: string): CompilerOptions => {
	const config = pkgConf.sync('tsd-check', {
		cwd,
		defaults: {
			compilerOptions: {
				strict: true,
				jsx: JsxEmit.React,
				target: ScriptTarget.ES2017
			}
		}
	});

	return {
		...config.compilerOptions,
		...{
			moduleResolution: ModuleResolutionKind.NodeJs,
			skipLibCheck: true
		}
	};
};

/**
 * Extract all the `expectError` statements and convert it to a range map.
 *
 * @param sourceFile - File to extract the statements from.
 */
const extractExpectErrorRanges = (sourceFile: SourceFile) => {
	const expectedErrors = new Map<Position, Pick<Diagnostic, 'fileName' | 'line' | 'column'>>();

	for (const statement of sourceFile.statements) {
		if (statement.kind !== SyntaxKind.ExpressionStatement || !statement.getText().startsWith('expectError')) {
			continue;
		}

		const position = {
			fileName: sourceFile.fileName,
			start: statement.getStart(),
			end: statement.getEnd()
		};

		const pos = statement.getSourceFile().getLineAndCharacterOfPosition(statement.getStart());

		expectedErrors.set(position, {
			fileName: statement.getSourceFile().fileName,
			line: pos.line + 1,
			column: pos.character
		});
	}

	return expectedErrors;
};

/**
 * Check if the provided diagnostic should be ignored.
 *
 * @param diagnostic - The diagnostic to validate.
 * @param expectedErrors - Map of the expected errors.
 * @return Boolean indicating if the diagnostic should be ignored or not.
 */
const ignoreDiagnostic = (diagnostic: TSDiagnostic, expectedErrors: Map<Position, any>): boolean => {
	if (ignoredDiagnostics.has(diagnostic.code)) {
		// Filter out diagnostics which are present in the `ignoredDiagnostics` set
		return true;
	}

	if (diagnostic.code !== DiagnosticCode.ArgumentTypeIsNotAssignableToParameterType) {
		return false;
	}

	for (const [range] of expectedErrors) {
		const start = diagnostic.start as number;

		if (
			diagnostic.file &&
			diagnostic.file.fileName === range.fileName &&
			start > range.start &&
			start < range.end
		) {
			// Remove the expected error from the Map so it's not being reported as failure
			expectedErrors.delete(range);
			return true;
		}
	}

	return false;
};

/**
 * Get a list of TypeScript diagnostics within the current context.
 *
 * @param context - The context object.
 * @returns List of diagnostics
 */
export const getDiagnostics = (context: Context): Diagnostic[] => {
	const compilerOptions = loadConfig(context.cwd);

	const fileName = path.join(context.cwd, context.testFile);

	const result: Diagnostic[] = [];

	const program = createProgram([fileName], compilerOptions);

	const diagnostics = program
		.getSemanticDiagnostics()
		.concat(program.getSyntacticDiagnostics());

	const expectedErrors = program
		.getSourceFiles()
		.filter(file => !file.isDeclarationFile)
		.map(file => extractExpectErrorRanges(file))
		.reduce((acc, rangesForFile) => {
			for (const [position, diagnostic] of rangesForFile.entries()) {
				acc.set(position, diagnostic);
			}

			return acc;
		}, new Map());

	for (const diagnostic of diagnostics) {
		if (!diagnostic.file || ignoreDiagnostic(diagnostic, expectedErrors)) {
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

	for (const [, diagnostic] of expectedErrors) {
		result.push({
			...diagnostic,
			message: 'Expected an error, but found none.',
			severity: 'error'
		});
	}

	return result;
};
