import {JsxEmit, ScriptTarget, ModuleResolutionKind} from 'typescript';
import {Config} from './interfaces';

/**
 * Load the configuration settings.
 *
 * @param pkg - The package.json object.
 * @returns The config object.
 */
export default (pkg: any): Config => {
	const config = {
		directory: 'test-d',
		compilerOptions: {
			strict: true,
			jsx: JsxEmit.React,
			target: ScriptTarget.ES2017
		},
		...pkg['tsd-check']
	};

	return {
		...config,
		compilerOptions: {
			...config.compilerOptions,
			...{
				moduleResolution: ModuleResolutionKind.NodeJs,
				skipLibCheck: true
			}
		}
	};
};
