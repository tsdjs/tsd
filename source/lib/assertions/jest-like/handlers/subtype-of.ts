import {Diagnostic} from '../../../interfaces';
import {makeDiagnostic} from '../../../utils';
import {JestLikeAssertionNodes, JestLikeContext} from '..';
import {getTypes} from '../util';

export const subtypeOf = ({typeChecker}: JestLikeContext, nodes: JestLikeAssertionNodes): Diagnostic[] => {
	const diagnostics: Diagnostic[] = [];

	if (!nodes) {
		return diagnostics;
	}

	for (const node of nodes) {
		const [expectedNode, targetNode] = node;

		const expected = getTypes(expectedNode, typeChecker);

		if (expected.diagnostic) {
			diagnostics.push(expected.diagnostic);
			continue;
		}

		const target = getTypes(targetNode, typeChecker);

		if (target.diagnostic) {
			diagnostics.push(target.diagnostic);
			continue;
		}

		if (!typeChecker.isTypeSubtypeOf(expected.type, target.type)) {
			diagnostics.push(makeDiagnostic(expectedNode, `Expected type \`${typeChecker.typeToString(expected.type)}\` is not a subtype of \`${typeChecker.typeToString(target.type)}\`.`));
		}
	}

	return diagnostics;
};
