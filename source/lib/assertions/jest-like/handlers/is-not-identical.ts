import {TypeChecker} from '@tsd/typescript';
import {Diagnostic} from '../../../interfaces';
import {JestLikeAssertionNodes} from '..';

/**
 * Asserts that the argument of the assertion is identical to the generic type of the assertion.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectType` AST nodes.
 * @return List of custom diagnostics.
 */
export const isNotIdentical = (_checker: TypeChecker, nodes: JestLikeAssertionNodes): Diagnostic[] => {
	const diagnostics: Diagnostic[] = [];

	console.log('>>>> isNotIdentical', nodes);

	return diagnostics;
};
