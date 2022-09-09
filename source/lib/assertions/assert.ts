/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Check that the type of `value` is identical to type `T`.
 *
 * @param value - Value that should be identical to type `T`.
 */
// @ts-expect-error
export const expectType = <T>(value: T) => {
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Check that the type of `value` is not identical to type `T`.
 *
 * @param value - Value that should be identical to type `T`.
 */
// @ts-expect-error
export const expectNotType = <T>(value: any) => {
	// eslint-disable-next-line no-warning-comments
	// TODO Use a `not T` type when possible https://github.com/microsoft/TypeScript/pull/29317
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Check that the type of `value` is assignable to type `T`.
 *
 * @param value - Value that should be assignable to type `T`.
 */
// @ts-expect-error
export const expectAssignable = <T>(value: T) => {
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Check that the type of `value` is not assignable to type `T`.
 *
 * @param value - Value that should not be assignable to type `T`.
 */
// @ts-expect-error
export const expectNotAssignable = <T>(value: any) => {
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Assert the value to throw an argument error.
 *
 * @param value - Value that should be checked.
 */
// @ts-expect-error
export const expectError = <T = any>(value: T) => {
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Assert that the `expression` provided is marked as `@deprecated`.
 *
 * @param expression - Expression that should be marked as `@deprecated`.
 */
// @ts-expect-error
export const expectDeprecated = (expression: any) => {
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Assert that the `expression` provided is not marked as `@deprecated`.
 *
 * @param expression - Expression that should not be marked as `@deprecated`.
 */
// @ts-expect-error
export const expectNotDeprecated = (expression: any) => {
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Will print a warning with the type of the expression passed as argument.
 *
 * @param expression - Expression whose type should be printed as a warning.
 */
// @ts-expect-error
export const printType = (expression: any) => {
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Assert that the documentation comment of `expression` is
 * the same as the given string literal in type `T`.
 * 
 * @param expression - Expression whose documentation comment should match the given string literal type `T`.
 */
// @ts-expect-error
export const expectDocComment = <T>(expression: any) => {
	// Do nothing, the TypeScript compiler handles this for us
};
