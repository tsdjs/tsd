export interface Options {
	/**
	 * @deprecated
	 */
	readonly separator: string;
	readonly delimiter: string;
}

declare const concat: {
	/**
	 * @deprecated
	 */
	(foo: string, bar: string): string;
	(foo: string, bar: string, options: Options): string;
	(foo: number, bar: number): number;
};

export const enum Unicorn {
	/**
	 * @deprecated
	 */
	UNICORN = '🦄',
	RAINBOW = '🌈'
}

export default concat;
