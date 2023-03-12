declare const one: {
	(foo: string, bar: string): Promise<string>;
	(foo: number, bar: number): Promise<number>;
};

export default one;
