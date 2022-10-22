import {TypeChecker} from '@tsd/typescript';
import {Diagnostic} from '../../../interfaces';
import {makeDiagnostic} from '../../../utils';
import {JestLikeAssertionNodes} from '..';
import {getTypes} from '../util';

/**
 * Asserts that the argument of the assertion is identical to the generic type of the assertion.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectType` AST nodes.
 * @return List of custom diagnostics.
 */
export const isNotIdentical = (checker: TypeChecker, nodes: JestLikeAssertionNodes): Diagnostic[] => {
	const diagnostics: Diagnostic[] = [];

	if (!nodes) {
		return diagnostics;
	}

	for (const node of nodes) {
		const [expectedNode, targetNode] = node;

		const expected = getTypes(expectedNode, checker);

		if (expected.diagnostic) {
			diagnostics.push(expected.diagnostic);
			continue;
		}

		const target = getTypes(targetNode, checker);

		if (target.diagnostic) {
			diagnostics.push(target.diagnostic);
			continue;
		}

		if (checker.isTypeIdenticalTo(expected.type, target.type)) {
			diagnostics.push(makeDiagnostic(expectedNode, `Parameter type \`${checker.typeToString(expected.type)}\` is identical to argument type \`${checker.typeToString(target.type)}\`.`));
		}
	}

	return diagnostics;
};
