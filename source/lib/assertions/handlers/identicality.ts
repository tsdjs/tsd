import {CallExpression, TypeChecker, TypeFlags} from '@tsd/typescript';
import {Diagnostic} from '../../interfaces';
import {makeDiagnostic} from '../../utils';

/**
 * Asserts that the argument of the assertion is identical to the generic type of the assertion.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectType` AST nodes.
 * @return List of custom diagnostics.
 */
export const isIdentical = (checker: TypeChecker, nodes: Set<CallExpression>): Diagnostic[] => {
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

		// Retrieve the argument type. This is the type to be checked.
		const argumentType = checker.getTypeAtLocation(node.arguments[0]);

		if (!checker.isTypeAssignableTo(argumentType, expectedType)) {
			// The argument type is not assignable to the expected type. TypeScript will catch this for us.
			continue;
		}

		if (!checker.isTypeAssignableTo(expectedType, argumentType)) {
			/**
			 * The expected type is not assignable to the argument type, but the argument type is
			 * assignable to the expected type. This means our type is too wide.
			 */
			diagnostics.push(makeDiagnostic(node, `Parameter type \`${checker.typeToString(expectedType)}\` is declared too wide for argument type \`${checker.typeToString(argumentType)}\`.`));
		} else if (!checker.isTypeIdenticalTo(expectedType, argumentType)) {
			/**
			 * The expected type and argument type are assignable in both directions. We still have to check
			 * if the types are identical. See https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#3.11.2.
			 */
			diagnostics.push(makeDiagnostic(node, `Parameter type \`${checker.typeToString(expectedType)}\` is not identical to argument type \`${checker.typeToString(argumentType)}\`.`));
		}
	}

	return diagnostics;
};

/**
 * Asserts that the argument of the assertion is not identical to the generic type of the assertion.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectNotType` AST nodes.
 * @return List of custom diagnostics.
 */
export const isNotIdentical = (checker: TypeChecker, nodes: Set<CallExpression>): Diagnostic[] => {
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

		if (checker.isTypeIdenticalTo(expectedType, argumentType)) {
			diagnostics.push(makeDiagnostic(node, `Parameter type \`${checker.typeToString(expectedType)}\` is identical to argument type \`${checker.typeToString(argumentType)}\`.`));
		}
	}

	return diagnostics;
};

/**
 * Verifies that the argument of the assertion is `never`
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectNever` AST nodes.
 * @return List of custom diagnostics.
 */
export const isNever = (checker: TypeChecker, nodes: Set<CallExpression>): Diagnostic[] => {
	const diagnostics: Diagnostic[] = [];

	if (!nodes) {
		return diagnostics;
	}

	for (const node of nodes) {
		const argumentType = checker.getTypeAtLocation(node.arguments[0]);

		if (argumentType.flags !== TypeFlags.Never) {
			diagnostics.push(makeDiagnostic(node, `Argument of type \`${checker.typeToString(argumentType)}\` is not \`never\`.`));
		}
	}

	return diagnostics;
};
