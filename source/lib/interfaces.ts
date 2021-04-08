import {CompilerOptions} from '../../libraries/typescript';

export interface RawCompilerOptions {
	[option: string]: any;
}

export interface Config<Options = CompilerOptions> {
	directory: string;
	compilerOptions: Options;
}

export type RawConfig = Partial<Config<RawCompilerOptions>>;

export interface Context {
	cwd: string;
	pkg: any;
	typingsFile: string;
	testFiles: string[];
	config: Config;
}

export enum DiagnosticCode {
	TopLevelAwaitOnlyAllowedWhenModuleESNextOrSystem = 1378,
	GenericTypeRequiresTypeArguments = 2314,
	TypeIsNotAssignableToOtherType = 2322,
	TypeDoesNotSatisfyTheConstraint = 2344,
	PropertyDoesNotExistOnType = 2339,
	ArgumentTypeIsNotAssignableToParameterType = 2345,
	CannotAssignToReadOnlyProperty = 2540,
	ExpectedArgumentsButGotOther = 2554,
	TypeHasNoPropertiesInCommonWith = 2559,
	NoOverloadMatches = 2769,
	PropertyMissingInType1ButRequiredInType2 = 2741,
}

export interface Diagnostic {
	fileName: string;
	message: string;
	severity: 'error' | 'warning';
	line?: number;
	column?: number;
}

export interface Location {
	fileName: string;
	start: number;
	end: number;
}
