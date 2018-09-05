export interface Context {
	cwd: string;
	pkg: any;
	typingsFile: string;
	testFile: string;
}

export interface Diagnostic {
	fileName: string;
	message: string;
	severity: 'error' | 'warning';
	line?: number;
	column?: number;
}
