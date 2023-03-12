declare const one: {
	(foo: string, bar: string): string;
	(foo: number, bar: number): number;
	<T>(): T;
};

export default one;
