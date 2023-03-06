import {CallExpression, TypeChecker, TypeFormatFlags} from '@tsd/typescript';
import {Diagnostic} from '../../../interfaces';
import {makeDiagnostic, tsutils} from '../../../utils';

/**
 * Default formatting flags set by TS plus the {@link TypeFormatFlags.NoTruncation NoTruncation} flag.
 *
 * @see {@link https://github.dev/microsoft/TypeScript/blob/b975dfa1027d1f3073fa7cbe6f7045bf4c882785/src/compiler/checker.ts#L4717 TypeChecker.typeToString}
 */
const typeToStringFormatFlags =
	TypeFormatFlags.AllowUniqueESSymbolType |
	TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
	TypeFormatFlags.NoTruncation;

/**
 * Prints the type of the argument of the assertion as a warning.
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
		const typeString = checker.typeToString(argumentType, node, typeToStringFormatFlags);

		diagnostics.push(makeDiagnostic(node, `Type for expression \`${argumentExpression}\` is: \`${typeString}\``, 'warning'));
	}

	return diagnostics;
};

/**
 * Asserts that the documentation comment for the argument of the assertion
 * includes the string literal generic type of the assertion.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectDocCommentIncludes` AST nodes.
 * @return List of diagnostics.
 */
export const expectDocCommentIncludes = (checker: TypeChecker, nodes: Set<CallExpression>): Diagnostic[] => {
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

		if (docComment.includes(expectedDocComment)) {
			// Do nothing
			continue;
		}

		diagnostics.push(makeDiagnostic(node, `Documentation comment \`${docComment}\` for expression \`${expression}\` does not include expected \`${expectedDocComment}\`.`));
	}

	return diagnostics;
};
