/* eslint-disable @typescript-eslint/no-unused-vars */
import {api, AssertTypeAPI} from './api';

/**
 * Create a type assertion holder from the type provided in the first generic parameter.
 *
 * @template ExpectedType - The expected type that will be compared with another type.
 */
export function assertType<ExpectedType>(): AssertTypeAPI;

/**
 * Create a type assertion holder from the type provided in the first argument.
 *
 * @param expectedValue - The expected value whose type will be compared with another type.
 */
export function assertType<ExpectedValueType>(expectedValue: ExpectedValueType): AssertTypeAPI;

export function assertType(): AssertTypeAPI {
	return api;
}
