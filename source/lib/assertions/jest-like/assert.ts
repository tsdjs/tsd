/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Test that target type is identical to expected type.
 *
 * @template TargetType - The expected type that will be compared with another type.
 * @param targetValue - The expected value whose type will be compared with another type.
 */
// @ts-expect-error no-unused-vars
function identicalTo<TargetType>(targetValue?: TargetType) {}

/**
 * Test that target type is not identical to expected type.
 *
 * @template TargetType - The expected type that will be compared with another type.
 * @param targetValue - The expected value whose type will be compared with another type.
 */
// @ts-expect-error no-unused-vars
function notIdenticalTo<TargetType>(targetValue?: TargetType) {}

// Construct the public API.
const assertTypeAPI = {
	identicalTo,
	not: {
		identicalTo: notIdenticalTo,
	},
};

type AssertTypeAPI = typeof assertTypeAPI;

/**
 * Create a type assertion holder from the type provided in the first generic parameter or from the type of the first argument.
 *
 * @template ExpectedType - The expected type that will be compared with another type.
 * @param expectedValue - The expected value whose type will be compared with another type.
 */
// @ts-expect-error no-unused-vars
export function assertType<ExpectedType>(expectedValue?: unknown): AssertTypeAPI {
	return assertTypeAPI;
}
