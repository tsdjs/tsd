import {TypeChecker, CallExpression} from '../../../../libraries/typescript/lib/typescript';
import {Diagnostic} from '../../interfaces';
import {makeDiagnostic} from '../../utils';

/**
 * Performs strict type assertion between the argument if the assertion, and the generic type of the assertion.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectType` AST nodes.
 * @return List of custom diagnostics.
 */
export const strictAssertion = (checker: TypeChecker, nodes: Set<CallExpression>): Diagnostic[] => {
	const diagnostics: Diagnostic[] = [];

	if (!nodes) {
		return diagnostics;
	}

	for (const node of nodes) {
		if (!node.typeArguments) {
			// Skip if the node does not have generics
			continue;
		}

		// Retrieve the type to be expected. This is the type inside the generic.
		const expectedType = checker.getTypeFromTypeNode(node.typeArguments[0]);
		const argumentType = checker.getTypeAtLocation(node.arguments[0]);

		if (!checker.isAssignableTo(argumentType, expectedType)) {
			// The argument type is not assignable to the expected type. TypeScript will catch this for us.
			continue;
		}

		if (!checker.isAssignableTo(expectedType, argumentType)) { // tslint:disable-line:early-exit
			/**
			 * The expected type is not assignable to the argument type, but the argument type is
			 * assignable to the expected type. This means our type is too wide.
			 */
			diagnostics.push(makeDiagnostic(node, `Parameter type \`${checker.typeToString(expectedType)}\` is declared too wide for argument type \`${checker.typeToString(argumentType)}\`.`));
		}
	}

	return diagnostics;
};
