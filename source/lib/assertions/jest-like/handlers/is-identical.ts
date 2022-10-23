import {TypeChecker} from '@tsd/typescript';
import {Diagnostic} from '../../../interfaces';
import {makeDiagnostic} from '../../../utils';
import {JestLikeAssertionNodes} from '..';
import {getTypes} from '../util';

export const isIdentical = (checker: TypeChecker, nodes: JestLikeAssertionNodes): Diagnostic[] => {
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

		if (!checker.isTypeAssignableTo(expected.type, target.type)) {
			diagnostics.push(makeDiagnostic(expectedNode, `Expected type \`${checker.typeToString(expected.type)}\` is declared too wide for type \`${checker.typeToString(target.type)}\`.`));
			continue;
		}

		if (!checker.isTypeAssignableTo(target.type, expected.type)) {
			diagnostics.push(makeDiagnostic(expectedNode, `Expected type \`${checker.typeToString(expected.type)}\` is declared too short for type \`${checker.typeToString(target.type)}\`.`));
			continue;
		}

		if (!checker.isTypeIdenticalTo(expected.type, target.type)) {
			diagnostics.push(makeDiagnostic(expectedNode, `Expected type \`${checker.typeToString(expected.type)}\` is not identical to type \`${checker.typeToString(target.type)}\`.`));
		}
	}

	return diagnostics;
};
