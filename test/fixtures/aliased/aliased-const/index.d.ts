declare const one: {
	(foo: string, bar: string): string;
	(foo: number, bar: number): number;
	<T extends string>(foo: T, bar: T): string;
};

export default one;
