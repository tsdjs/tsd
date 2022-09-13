import {CallExpression, TypeChecker} from '@tsd/typescript';
import {Diagnostic} from '../interfaces';
import {
	Handler,
	isIdentical,
	isNotIdentical,
	isNotAssignable,
	expectDeprecated,
	expectNotDeprecated,
	isNever,
	printTypeWarning,
	expectDocCommentIncludes,
} from './handlers';

export enum Assertion {
	EXPECT_TYPE = 'expectType',
	EXPECT_NOT_TYPE = 'expectNotType',
	EXPECT_ERROR = 'expectError',
	EXPECT_ASSIGNABLE = 'expectAssignable',
	EXPECT_NOT_ASSIGNABLE = 'expectNotAssignable',
	EXPECT_DEPRECATED = 'expectDeprecated',
	EXPECT_NOT_DEPRECATED = 'expectNotDeprecated',
	EXPECT_NEVER = 'expectNever',
	PRINT_TYPE = 'printType',
	EXPECT_DOC_COMMENT_INCLUDES = 'expectDocCommentIncludes',
}

// List of diagnostic handlers attached to the assertion
const assertionHandlers = new Map<Assertion, Handler>([
	[Assertion.EXPECT_TYPE, isIdentical],
	[Assertion.EXPECT_NOT_TYPE, isNotIdentical],
	[Assertion.EXPECT_NOT_ASSIGNABLE, isNotAssignable],
	[Assertion.EXPECT_DEPRECATED, expectDeprecated],
	[Assertion.EXPECT_NOT_DEPRECATED, expectNotDeprecated],
	[Assertion.EXPECT_NEVER, isNever],
	[Assertion.PRINT_TYPE, printTypeWarning],
	[Assertion.EXPECT_DOC_COMMENT_INCLUDES, expectDocCommentIncludes],
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

		diagnostics.push(...handler(typeChecker, nodes));
	}

	return diagnostics;
};
