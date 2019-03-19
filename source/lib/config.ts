import {JsxEmit, ScriptTarget, ModuleResolutionKind} from 'typescript';
import {Config} from './interfaces';

/**
 * Load the configuration settings.
 *
 * @param pkg - The package.json object.
 * @returns The config object.
 */
export default (pkg: {'tsd-check'?: Partial<Config>}): Config => {
	const pkgConfig = pkg['tsd-check'] || {};

	return {
		directory: 'test-d',
		...pkgConfig,
		compilerOptions: {
			strict: true,
			jsx: JsxEmit.React,
			target: ScriptTarget.ES2017,
			...pkgConfig.compilerOptions,
			...{
				moduleResolution: ModuleResolutionKind.NodeJs,
				skipLibCheck: true
			}
		}
	};
};
