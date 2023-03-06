import {CallExpression, Node, TypeChecker} from '@tsd/typescript';
import {Diagnostic} from '../../interfaces';

import * as handlers from '../jest-like/handlers';

export type JestLikeAssertion = keyof typeof handlers;
export type JestLikeAssertionNodes = Set<[CallExpression, CallExpression]>;
export type JestLikeHandler = (typeChecker: TypeChecker, nodes: JestLikeAssertionNodes) => Diagnostic[];
export type JestLikeAssertionHandlers = Map<JestLikeAssertion, JestLikeHandler>;
export type JestLikeAssertions = Map<JestLikeAssertion, JestLikeAssertionNodes>;

export type JestLikeErrorLocation = {start: number; end: number};
export type JestLikeExpectedError = {node: Node; code?: number; message?: string; regexp?: RegExp};

export type JestLikeContext = {
	typeChecker: TypeChecker;
	assertions: JestLikeAssertions;
	expectedErrors: Map<JestLikeErrorLocation, JestLikeExpectedError>;
};

/**
 * Returns a list of diagnostics based on the assertions provided.
 *
 * @param context - See {@link JestLikeContext}
 * @returns List of diagnostics.
 */
export const jestLikeHandle = (context: JestLikeContext): Diagnostic[] => {
	const diagnostics: Diagnostic[] = [];

	for (const [assertion, nodes] of context.assertions) {
		const handler = handlers[assertion];

		if (!handler) {
			// Ignore these assertions as no handler is found
			continue;
		}

		diagnostics.push(...handler(context, nodes));
	}

	return diagnostics;
};
