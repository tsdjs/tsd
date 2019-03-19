import {CompilerOptions} from 'typescript';

export interface Config {
	directory: string;
	compilerOptions: CompilerOptions;
}

export interface Context {
	cwd: string;
	pkg: any;
	typingsFile: string;
	testFiles: string[];
	config: Config;
}

export enum DiagnosticCode {
	AwaitIsOnlyAllowedInAsyncFunction = 1308,
	PropertyDoesNotExistOnType = 2339,
	ArgumentTypeIsNotAssignableToParameterType = 2345,
	CannotAssignToReadOnlyProperty = 2540
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
