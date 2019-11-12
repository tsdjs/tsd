/**
 * Check that the type of `value` is identical to type `T`.
 *
 * @param value - Value that should be identical to type `T`.
 */
// @ts-ignore
export const expectType = <T>(value: T) => {		// tslint:disable-line:no-unused
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Check that the type of `value` is assignable to type `T`.
 *
 * @param value - Value that should be assignable to type `T`.
 */
// @ts-ignore
export const expectAssignable = <T>(value: T) => {		// tslint:disable-line:no-unused
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Check that the type of `value` is not assignable to type `T`.
 *
 * @param value - Value that should not be assignable to type `T`.
 */
// @ts-ignore
export const expectNotAssignable = <T>(value: any) => {		// tslint:disable-line:no-unused
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
