import {CallExpression, TypeChecker} from '@tsd/typescript';
import {Diagnostic} from '../../interfaces';
import {makeDiagnostic} from '../../utils';

/**
 * Prints the type of the argument of the assertion as a warning.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `printType` AST nodes.
 * @return List of warning diagnostics containing the type of the first argument.
 */
export const prinTypeWarning = (checker: TypeChecker, nodes: Set<CallExpression>): Diagnostic[] => {
	const diagnostics: Diagnostic[] = [];

	if (!nodes) {
		return diagnostics;
	}

	for (const node of nodes) {
		const argumentType = checker.getTypeAtLocation(node.arguments[0]);
		const argumentExpression = node.arguments[0].getText();

		diagnostics.push(makeDiagnostic(node, `Type for expression \`${argumentExpression}\` is: \`${checker.typeToString(argumentType)}\``, 'warning'));
	}

	return diagnostics;
};
