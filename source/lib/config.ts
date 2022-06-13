import {
	JsxEmit,
	ScriptTarget,
	ModuleResolutionKind,
	parseJsonConfigFileContent,
	CompilerOptions,
	findConfigFile,
	sys,
	readJsonConfigFile,
	parseJsonSourceFileConfigFileContent,
	ModuleKind
} from '@tsd/typescript';
import {Config, PackageJsonWithTsdConfig, RawCompilerOptions} from './interfaces';

/**
 * Load the configuration settings.
 *
 * @param pkg - The package.json object.
 * @returns The config object.
 */
export default (pkg: PackageJsonWithTsdConfig, cwd: string): Config => {
	const pkgConfig = pkg.tsd ?? {};

	const tsConfigCompilerOptions = getOptionsFromTsConfig(cwd);
	const packageJsonCompilerOptions = parseCompilerConfigObject(
		pkgConfig.compilerOptions ?? {},
		cwd
	);

	const combinedCompilerOptions = {
		...tsConfigCompilerOptions,
		...packageJsonCompilerOptions,
	};

	return {
		directory: 'test-d',
		...pkgConfig,
		compilerOptions: {
			strict: true,
			jsx: JsxEmit.React,
			lib: parseRawLibs(['es2017', 'dom', 'dom.iterable'], cwd),
			module: ModuleKind.CommonJS,
			target: ScriptTarget.ES2017,
			esModuleInterop: true,
			...combinedCompilerOptions,
			moduleResolution: combinedCompilerOptions.module === undefined ?
				ModuleResolutionKind.NodeJs :
				combinedCompilerOptions.module === ModuleKind.NodeNext ?
					ModuleResolutionKind.NodeNext :
					combinedCompilerOptions.module === ModuleKind.Node16 ?
						ModuleResolutionKind.Node16 :
						ModuleResolutionKind.NodeJs,
			skipLibCheck: false
		}
	};
};

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
		cwd
	).options;
}

function parseRawLibs(libs: string[], cwd: string): string[] {
	return parseCompilerConfigObject({lib: libs}, cwd).lib ?? [];
}
