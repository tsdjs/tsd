declare const one: {
	(foo: string, bar: string): string;
	(foo: number, bar: number): number;
};

export default one;

export const foo: {readonly bar: string};

export function hasProperty(property: {name: string}): boolean;

export interface Options<T> {}
