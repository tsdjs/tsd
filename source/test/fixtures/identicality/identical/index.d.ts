declare const concat: {
	(foo: string, bar: string): string;
	(foo: number, bar: number): number;
};

export default concat;

export const returnsNever: () => never;
