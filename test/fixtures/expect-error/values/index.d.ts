declare const one: {
	(foo: string, bar: string): string;
	(foo: number, bar: number): number;
};

export default one;

export const foo: {readonly bar: string};

export function hasProperty(property: {name: string}): boolean;

export type HasKey<K extends string, V = unknown> = {[P in K]?: V};

export function getFoo<T extends HasKey<'foo'>>(obj: T): T['foo'];

export function atLeastOne(...expected: [unknown, ...Array<unknown>]): void;

export interface Options<T> {}

export class MyClass {}

export const triggerSuggestion: {
	// fooOrBar must be of union type to trigger TS2820, otherwise TypeScript will
	// emit a regular TS2322 error without the "Did you mean..." suggestion.
	fooOrBar: 'foo' | 'bar';
};

export type ReadonlyKeys = {
	readonly [type: string]: any;
}
