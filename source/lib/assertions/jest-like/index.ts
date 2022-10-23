import {CallExpression, TypeChecker} from '@tsd/typescript';
import {Diagnostic} from '../../interfaces';

import * as handlers from '../jest-like/handlers';

export type JestLikeAssertion = keyof typeof handlers;
export type JestLikeAssertionNodes = Set<[CallExpression, CallExpression]>;
export type JestLikeHandler = (typeChecker: TypeChecker, nodes: JestLikeAssertionNodes) => Diagnostic[];
export type JestLikeAssertionHandlers = Map<JestLikeAssertion, JestLikeHandler>;
export type JestLikeAssertions = Map<JestLikeAssertion, JestLikeAssertionNodes>;

/**
 * Returns a list of diagnostics based on the assertions provided.
 *
 * @param typeChecker - The TypeScript type checker.
 * @param assertions - Assertion map with the key being the assertion, and the value the list of all those assertion nodes.
 * @returns List of diagnostics.
 */
export const jestLikeHandle = (typeChecker: TypeChecker, assertions: JestLikeAssertions): Diagnostic[] => {
	const diagnostics: Diagnostic[] = [];

	for (const [assertion, nodes] of assertions) {
		const handler = handlers[assertion];

		if (!handler) {
			// Ignore these assertions as no handler is found
			continue;
		}

		diagnostics.push(...handler(typeChecker, nodes));
	}

	return diagnostics;
};
