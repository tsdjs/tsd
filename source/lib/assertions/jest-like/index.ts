import {CallExpression, TypeChecker} from '@tsd/typescript';
import {Diagnostic} from '../../interfaces';
import {isIdentical, isNotIdentical} from '../jest-like/handlers';

export type JestLikeAssertionNodes = Set<[CallExpression, CallExpression]>;

/**
 * A handler is a method which accepts the TypeScript type checker together with a set of assertion nodes. The type checker
 * can be used to retrieve extra type information from these nodes in order to determine a list of diagnostics.
 *
 * @param typeChecker - The TypeScript type checker.
 * @param nodes - List of nodes.
 * @returns List of diagnostics.
 */
export type JestLikeHandler = (typeChecker: TypeChecker, nodes: JestLikeAssertionNodes) => Diagnostic[];

export type JestLikeAssertionHandlers = Map<JestLikeAssertion, JestLikeHandler>;
export type JestLikeAssertions = Map<JestLikeAssertion, JestLikeAssertionNodes>;

export enum JestLikeAssertion {
	IDENTICAL_TO = 'identicalTo',
	NOT_IDENTICAL_TO = 'notIdenticalTo',
}

// List of diagnostic handlers attached to the assertion
const assertionHandlers: JestLikeAssertionHandlers = new Map([
	[JestLikeAssertion.IDENTICAL_TO, isIdentical],
	[JestLikeAssertion.NOT_IDENTICAL_TO, isNotIdentical],
]);

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
		const handler = assertionHandlers.get(assertion);

		if (!handler) {
			// Ignore these assertions as no handler is found
			continue;
		}

		diagnostics.push(...handler(typeChecker, nodes));
	}

	return diagnostics;
};
