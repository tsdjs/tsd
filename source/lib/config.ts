import ts, {type CompilerOptions} from '@tsd/typescript';
import type {Config, PackageJsonWithTsdConfig, RawCompilerOptions} from './interfaces.js';

/**
 * Load the configuration settings.
 *
 * @param pkg - The package.json object.
 * @returns The config object.
 */
const loadConfig = (pkg: PackageJsonWithTsdConfig, cwd: string): Config => {
	const pkgConfig = pkg.tsd ?? {};

	const tsConfigCompilerOptions = getOptionsFromTsConfig(cwd);
	const packageJsonCompilerOptions = parseCompilerConfigObject(
		pkgConfig.compilerOptions ?? {},
		cwd,
	);

	const combinedCompilerOptions = {
		...tsConfigCompilerOptions,
		...packageJsonCompilerOptions,
	};

	const module = combinedCompilerOptions.module ?? ts.ModuleKind.CommonJS;

	return {
		directory: 'test-d',
		...pkgConfig,
		compilerOptions: {
			strict: true,
			jsx: ts.JsxEmit.React,
			lib: parseRawLibs(['es2022', 'dom', 'dom.iterable'], cwd),
			module,
			target: ts.ScriptTarget.ES2020,
			esModuleInterop: true,
			noUnusedLocals: false,
			...combinedCompilerOptions,
			moduleResolution: module === ts.ModuleKind.NodeNext
				? ts.ModuleResolutionKind.NodeNext
				: (module === ts.ModuleKind.Node16
					? ts.ModuleResolutionKind.Node16
					: ts.ModuleResolutionKind.Node10),
			skipLibCheck: false,
		},
	};
};

export default loadConfig;

function getOptionsFromTsConfig(cwd: string): CompilerOptions {
	const configPath = ts.findConfigFile(cwd, ts.sys.fileExists);

	if (!configPath) {
		return {};
	}

	return ts.parseJsonSourceFileConfigFileContent(
		ts.readJsonConfigFile(configPath, ts.sys.readFile),
		ts.sys,
		cwd,
		undefined,
		configPath,
	).options;
}

function parseCompilerConfigObject(compilerOptions: RawCompilerOptions, cwd: string): CompilerOptions {
	return ts.parseJsonConfigFileContent(
		{compilerOptions: compilerOptions || {}},
		ts.sys,
		cwd,
	).options;
}

function parseRawLibs(libs: string[], cwd: string): string[] {
	return parseCompilerConfigObject({lib: libs}, cwd).lib ?? [];
}
