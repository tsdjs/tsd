/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Test that the expected type is assignable to the type provided in the first generic parameter.
 *
 * @template TargetType - The target type that will be compared with expected type.
 */
export function assignableTo<TargetType>(): void;

/**
 * Test that the expected type is assignable to the type of the expression provided in the first argument.
 *
 * @param expression - An expression whose type will be compared with expected type.
 */
export function assignableTo<ExpressionType>(expression: ExpressionType): void;

export function assignableTo(): void { }
