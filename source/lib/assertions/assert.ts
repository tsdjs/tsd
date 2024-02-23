/**
 * Asserts that the type of `expression` is identical to type `T`.
 *
 * @param expression - Expression that should be identical to type `T`.
 */
export declare const expectType: <T>(expression: T) => void;

/**
 * Asserts that the type of `expression` is not identical to type `T`.
 *
 * @param expression - Expression that should not be identical to type `T`.
*/
// eslint-disable-next-line no-warning-comments
// TODO Use a `not T` type when possible https://github.com/microsoft/TypeScript/pull/29317
export declare const expectNotType: <T>(expression: any) => void;

/**
 * Asserts that the type of `expression` is assignable to type `T`.
 *
 * @param expression - Expression that should be assignable to type `T`.
 */
export declare const expectAssignable: <T>(expression: T) => void;

/**
 * Asserts that the type of `expression` is not assignable to type `T`.
 *
 * @param expression - Expression that should not be assignable to type `T`.
 */
export declare const expectNotAssignable: <T>(expression: any) => void;

/**
 * Asserts that `expression` throws an error. Will not ignore syntax errors.
 *
 * @param expression - Expression that should throw an error.
 */
export declare const expectError: <T = any>(expression: T) => void;

/**
 * Asserts that `expression` is marked as `@deprecated`.
 *
 * @param expression - Expression that should be marked as `@deprecated`.
 */
export declare const expectDeprecated: (expression: any) => void;

/**
 * Asserts that `expression` is not marked as `@deprecated`.
 *
 * @param expression - Expression that should not be marked as `@deprecated`.
 */
export declare const expectNotDeprecated: (expression: any) => void;

/**
 * Asserts that the type and return type of `expression` is `never`.
 *
 * Useful for checking that all branches are covered.
 *
 * @param expression - Expression that should be `never`.
 */
export const expectNever = (expression: never): never => expression;

/**
 * Prints the type of `expression` as a warning.
 *
 * @param expression - Expression whose type should be printed as a warning.
 */
export declare const printType: (expression: any) => void;

/**
 * Asserts that the documentation comment of `expression` includes string literal type `T`.
 *
 * @param expression - Expression whose documentation comment should include string literal type `T`.
 */
export declare const expectDocCommentIncludes: <T>(expression: any) => void;
