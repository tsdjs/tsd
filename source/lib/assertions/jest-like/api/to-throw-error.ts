/* eslint-disable @typescript-eslint/no-empty-function */

/**
 * Test that the expected type throw a type error.
 */
export function toThrowError(): void;

/**
 * Test that the expected type throw a type error with expected code.
 *
 * @param code - The expected error code.
 */
export function toThrowError<Code extends number>(code: Code): void;

/**
 * Test that the expected type throw a type error with expected code.
 *
 * @param regexp - A regular expression that must match the message.
 */
export function toThrowError<Pattern extends RegExp>(regexp: Pattern): void;

/**
 * Test that the expected type throw a type error with expected message.
 *
 * @param message - The expected error message or a regular expression to match the error message.
 */
export function toThrowError<Message extends string>(message: Message): void;

export function toThrowError(): void { }
