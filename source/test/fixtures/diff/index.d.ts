export type FooType = {foo?: 'foo'};

export interface FooInterface {
	[x: string]: unknown;
	readonly protected: boolean;
	fooType?: FooType;
	id: 'foo-interface';
}

export type FooFunction = (x?: string) => number;

declare const foo: <T>(foo: T) => T;

export default foo;
