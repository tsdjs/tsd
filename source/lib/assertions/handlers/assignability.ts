import {CallExpression, TypeChecker} from '@tsd/typescript';
import {Diagnostic} from '../../interfaces.js';
import {makeDiagnosticWithDiff} from '../../utils/index.js';

/**
 * Asserts that the argument of the assertion is not assignable to the generic type of the assertion.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectNotAssignable` AST nodes.
 * @return List of custom diagnostics.
 */
export const isNotAssignable = (checker: TypeChecker, nodes: Set<CallExpression>): Diagnostic[] => {
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
		const receivedType = checker.getTypeAtLocation(node.arguments[0]);

		if (checker.isTypeAssignableTo(receivedType, expectedType)) {
			/**
			 * The argument type is assignable to the expected type, we don't want this so add a diagnostic.
			 */
			diagnostics.push(makeDiagnosticWithDiff({
				message: 'Argument of type `{receivedType}` is assignable to parameter of type `{expectedType}`.',
				expectedType,
				receivedType,
				checker,
				node,
			}));
		}
	}

	return diagnostics;
};
