/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Test that the type provided in the first generic parameter is identical to expected type.
 *
 * @template TargetType - The expected type that will be compared with another type.
 */
export function assignableTo<TargetType>(): void;

/**
 * Test that the type provided in the first argument is identical to expected type.
 *
 * @param targetValue - The expected value whose type will be compared with another type.
 */
export function assignableTo<TargetValueType>(targetValue: TargetValueType): void;

export function assignableTo(): void { }
