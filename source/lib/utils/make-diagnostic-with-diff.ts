import {Node, Type, TypeChecker, TypeFormatFlags} from '@tsd/typescript';
import {Diagnostic} from '../interfaces';

interface DiagnosticWithDiffOptions {
	checker: TypeChecker;
	node: Node;
	message: string;
	expectedType: Type | string;
	receivedType: Type | string;
	severity?: Diagnostic['severity'];
}

const typeToStringFormatFlags =
	TypeFormatFlags.NoTruncation |
	TypeFormatFlags.WriteArrayAsGenericType |
	TypeFormatFlags.UseStructuralFallback |
	// TypeFormatFlags.WriteTypeArgumentsOfSignature |
	// TypeFormatFlags.UseFullyQualifiedType |
	// TypeFormatFlags.SuppressAnyReturnType |
	// TypeFormatFlags.MultilineObjectLiterals |
	// TypeFormatFlags.WriteClassExpressionAsTypeLiteral |
	// TypeFormatFlags.UseTypeOfFunction |
	// TypeFormatFlags.OmitParameterModifiers |
	TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
	TypeFormatFlags.UseSingleQuotesForStringLiteralType |
	TypeFormatFlags.NoTypeReduction |
	// TypeFormatFlags.OmitThisParameter |
	TypeFormatFlags.AllowUniqueESSymbolType |
	// TypeFormatFlags.AddUndefined |
	// TypeFormatFlags.WriteArrowStyleSignature |
	TypeFormatFlags.InArrayType |
	TypeFormatFlags.InElementType |
	TypeFormatFlags.InFirstTypeArgument |
	TypeFormatFlags.InTypeAlias;
	// TypeFormatFlags.NodeBuilderFlagsMask |;

/**
 * Create a diagnostic with type error diffs from the given `options`, see {@link DiagnosticWithDiffOptions}.
 *
 * @param options - Options for creating the diagnostic.
 * @returns Diagnostic with diffs
 */
 export default (options: DiagnosticWithDiffOptions): Diagnostic => {
	const {checker, node, expectedType, receivedType} = options;
	const position = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart());
	const message = options.message
		.replace('{expectedType}', typeof expectedType === 'string' ? expectedType : checker.typeToString(expectedType))
		.replace('{receivedType}', typeof receivedType === 'string' ? receivedType : checker.typeToString(receivedType));

	return {
		fileName: node.getSourceFile().fileName,
		message,
		severity: options.severity ?? 'error',
		line: position.line + 1,
		column: position.character,
		diff: {
			expected: typeof expectedType === 'string' ? expectedType : checker.typeToString(expectedType, node, typeToStringFormatFlags),
			received: typeof receivedType === 'string' ? receivedType : checker.typeToString(receivedType, node, typeToStringFormatFlags)
		}
	};
};
