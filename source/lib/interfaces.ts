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
	verbose: boolean;
}

export enum DiagnosticCode {
	AwaitIsOnlyAllowedInAsyncFunction = 1308,
	GenericTypeRequiresTypeArguments = 2314,
	TypeIsNotAssignableToOtherType = 2322,
	PropertyDoesNotExistOnType = 2339,
	ArgumentTypeIsNotAssignableToParameterType = 2345,
	CannotAssignToReadOnlyProperty = 2540,
	ExpectedArgumentsButGotOther = 2554,
	NoOverloadMatches = 2769
}

export interface Diagnostic {
	fileName: string;
	message: string;
	severity: 'error' | 'warning';
	line?: number;
	column?: number;
}

export interface ExtendedDiagnostic {
	numTests: number;
	diagnostics: Diagnostic[];
}

export interface Location {
	fileName: string;
	start: number;
	end: number;
}
