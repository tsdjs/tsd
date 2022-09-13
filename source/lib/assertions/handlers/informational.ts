import {CallExpression, TypeChecker, TypeFormatFlags} from '@tsd/typescript';
import {Diagnostic} from '../../interfaces';
import {makeDiagnostic} from '../../utils';

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
export const prinTypeWarning = (checker: TypeChecker, nodes: Set<CallExpression>): Diagnostic[] => {
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
