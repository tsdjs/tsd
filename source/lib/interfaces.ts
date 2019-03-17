export interface Context {
	cwd: string;
	pkg: any;
	typingsFile: string;
	testFile: string;
}

export enum DiagnosticCode {
	AwaitIsOnlyAllowedInAsyncFunction = 1308,
	ArgumentTypeIsNotAssignableToParameterType = 2345
}

export interface Diagnostic {
	fileName: string;
	message: string;
	severity: 'error' | 'warning';
	line?: number;
	column?: number;
}

export interface Position {
	fileName: string;
	start: number;
	end: number;
}
