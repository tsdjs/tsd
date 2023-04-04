import {
	type CompilerOptions,
	JsxEmit,
	ScriptTarget,
	ModuleResolutionKind,
	parseJsonConfigFileContent,
	findConfigFile,
	sys,
	readJsonConfigFile,
	parseJsonSourceFileConfigFileContent,
	ModuleKind,
} from '@tsd/typescript';
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

	const module = combinedCompilerOptions.module ?? ModuleKind.CommonJS;

	return {
		directory: 'test-d',
		...pkgConfig,
		compilerOptions: {
			strict: true,
			jsx: JsxEmit.React,
			lib: parseRawLibs(['es2020', 'dom', 'dom.iterable'], cwd),
			module,
			target: ScriptTarget.ES2020,
			esModuleInterop: true,
			noUnusedLocals: false,
			...combinedCompilerOptions,
			moduleResolution: module === ModuleKind.NodeNext
				? ModuleResolutionKind.NodeNext
				: (module === ModuleKind.Node16
					? ModuleResolutionKind.Node16
					: ModuleResolutionKind.NodeJs),
			skipLibCheck: false,
		},
	};
};

export default loadConfig;

function getOptionsFromTsConfig(cwd: string): CompilerOptions {
	const configPath = findConfigFile(cwd, sys.fileExists);

	if (!configPath) {
		return {};
	}

	return parseJsonSourceFileConfigFileContent(
		readJsonConfigFile(configPath, sys.readFile),
		sys,
		cwd,
		undefined,
		configPath,
	).options;
}

function parseCompilerConfigObject(compilerOptions: RawCompilerOptions, cwd: string): CompilerOptions {
	return parseJsonConfigFileContent(
		{compilerOptions: compilerOptions || {}},
		sys,
		cwd,
	).options;
}

function parseRawLibs(libs: string[], cwd: string): string[] {
	return parseCompilerConfigObject({lib: libs}, cwd).lib ?? [];
}
