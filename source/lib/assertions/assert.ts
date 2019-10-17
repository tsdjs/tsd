/**
 * Check that `value` is identical to type `T`.
 *
 * @param value - Value that should be identical to type `T`.
 */
// @ts-ignore
export const expectType = <T>(value: T) => {		// tslint:disable-line:no-unused
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Assert the value to throw an argument error.
 *
 * @param value - Value that should be checked.
 */
// @ts-ignore
export const expectError = <T = any>(value: T) => {		// tslint:disable-line:no-unused
	// Do nothing, the TypeScript compiler handles this for us
};
