/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Asserts that the type of `expression` is identical to type `T`.
 *
 * @param expression - Expression that should be identical to type `T`.
 */
// @ts-expect-error
export const expectType = <T>(expression: T) => {
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Asserts that the type of `expression` is not identical to type `T`.
 *
 * @param expression - Expression that should not be identical to type `T`.
 */
// @ts-expect-error
export const expectNotType = <T>(expression: any) => {
	// eslint-disable-next-line no-warning-comments
	// TODO Use a `not T` type when possible https://github.com/microsoft/TypeScript/pull/29317
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Asserts that the type of `expression` is assignable to type `T`.
 *
 * @param expression - Expression that should be assignable to type `T`.
 */
// @ts-expect-error
export const expectAssignable = <T>(expression: T) => {
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Asserts that the type of `expression` is not assignable to type `T`.
 *
 * @param expression - Expression that should not be assignable to type `T`.
 */
// @ts-expect-error
export const expectNotAssignable = <T>(expression: any) => {
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Asserts that `expression` throws an error.
 *
 * @param expression - Expression that should throw an error.
 */
// @ts-expect-error
export const expectError = <T = any>(expression: T) => {
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Asserts that `expression` is marked as `@deprecated`.
 *
 * @param expression - Expression that should be marked as `@deprecated`.
 */
// @ts-expect-error
export const expectDeprecated = (expression: any) => {
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Asserts that `expression` is not marked as `@deprecated`.
 *
 * @param expression - Expression that should not be marked as `@deprecated`.
 */
// @ts-expect-error
export const expectNotDeprecated = (expression: any) => {
	// Do nothing, the TypeScript compiler handles this for us
};

/**
 * Asserts that the type and return type of `expression` is `never`.
 *
 * @param expression - Expression that should be `never`.
 */
export const expectNever = (expression: never): never => {
	return expression;
};

/**
 * Prints the type of `expression` as a warning.
 *
 * @param expression - Expression whose type should be printed as a warning.
 */
// @ts-expect-error
export const printType = (expression: any) => {
	// Do nothing, the TypeScript compiler handles this for us
};
