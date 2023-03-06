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
 * @param expression - The expected expression whose type will be compared with another type.
 */
export function assertType<ExpressionType>(expression: ExpressionType): AssertTypeAPI;

export function assertType() {
	return api;
}
