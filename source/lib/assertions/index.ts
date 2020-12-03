import {CallExpression, TypeChecker} from '../../../libraries/typescript/lib/typescript';
import {Diagnostic} from '../interfaces';
import {Handler, isIdentical, isNotIdentical, isNotAssignable, expectDeprecated, expectNotDeprecated} from './handlers';

export enum Assertion {
	EXPECT_TYPE = 'expectType',
	EXPECT_NOT_TYPE = 'expectNotType',
	EXPECT_ERROR = 'expectError',
	EXPECT_ASSIGNABLE = 'expectAssignable',
	EXPECT_NOT_ASSIGNABLE = 'expectNotAssignable',
	EXPECT_DEPRECATED = 'expectDeprecated',
	EXPECT_NOT_DEPRECATED = 'expectNotDeprecated'
}

// List of diagnostic handlers attached to the assertion
const assertionHandlers = new Map<string, Handler | Handler[]>([
	[Assertion.EXPECT_TYPE, isIdentical],
	[Assertion.EXPECT_NOT_TYPE, isNotIdentical],
	[Assertion.EXPECT_NOT_ASSIGNABLE, isNotAssignable],
	[Assertion.EXPECT_DEPRECATED, expectDeprecated],
	[Assertion.EXPECT_NOT_DEPRECATED, expectNotDeprecated]
]);

/**
 * Returns a list of diagnostics based on the assertions provided.
 *
 * @param typeChecker - The TypeScript type checker.
 * @param assertions - Assertion map with the key being the assertion, and the value the list of all those assertion nodes.
 * @returns List of diagnostics.
 */
export const handle = (typeChecker: TypeChecker, assertions: Map<Assertion, Set<CallExpression>>): Diagnostic[] => {
	const diagnostics: Diagnostic[] = [];

	for (const [assertion, nodes] of assertions) {
		const handler = assertionHandlers.get(assertion);

		if (!handler) {
			// Ignore these assertions as no handler is found
			continue;
		}

		const handlers = Array.isArray(handler) ? handler : [handler];

		// Iterate over the handlers and invoke them
		for (const fn of handlers) {
			diagnostics.push(...fn(typeChecker, nodes));
		}
	}

	return diagnostics;
};
