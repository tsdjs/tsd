import {CallExpression, TypeChecker} from '@tsd/typescript';
import {Diagnostic} from '../../interfaces';
import {makeDiagnostic, tsutils} from '../../utils';

/**
 * Emits a warning diagnostic for every call expression encountered containing the type of the first argument.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `printType` AST nodes.
 * @return List of warning diagnostics containing the type of the first argument.
 */
export const printTypeWarning = (checker: TypeChecker, nodes: Set<CallExpression>): Diagnostic[] => {
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

/**
 * Verifies that the documentation comment for the argument of the assertion
 * matches the string literal generic type of the assertion.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectDocComment` AST nodes.
 * @return List of diagnostics.
 */
export const expectDocComment = (checker: TypeChecker, nodes: Set<CallExpression>): Diagnostic[] => {
	const diagnostics: Diagnostic[] = [];

	if (!nodes) {
		return diagnostics;
	}

	for (const node of nodes) {
		const expression = tsutils.expressionToString(checker, node.arguments[0]) ?? '?';

		if (!node.typeArguments) {
			diagnostics.push(makeDiagnostic(node, `Expected documentation comment for expression \`${expression}\` not specified.`));
			continue;
		}

		const maybeExpectedDocComment = checker.getTypeFromTypeNode(node.typeArguments[0]);

		if (!maybeExpectedDocComment.isStringLiteral()) {
			diagnostics.push(makeDiagnostic(node, `Expected documentation comment for expression \`${expression}\` should be a string literal.`));
			continue;
		}

		const expectedDocComment = maybeExpectedDocComment.value;
		const docComment = tsutils.resolveDocComment(checker, node.arguments[0]);

		if (!docComment) {
			diagnostics.push(makeDiagnostic(node, `Documentation comment for expression \`${expression}\` not found.`));
			continue;
		}

		if (docComment !== expectedDocComment) {
			diagnostics.push(makeDiagnostic(node, `Expected documentation comment \`${expectedDocComment}\` for expression \`${expression}\` does not match \`${docComment}\`.`));
		}
	}

	return diagnostics;
};
