declare const one: {
	(foo: string, bar: string): string;
	(foo: number, bar: number): number;
	<T extends string>(foo: T, bar: T): string;
};

export default one;

export const two: {
	(foo: string): string;
	(foo: string, bar: string, baz: string): string;
};

export const three: {
	(foo: '*'): string;
	(foo: 'a' | 'b'): string;
	(foo: ReadonlyArray<'a' | 'b'>): string;
	(foo: never): string;
};
