import {Node, Type, TypeChecker, TypeFormatFlags} from '@tsd/typescript';
import {Diagnostic} from '../interfaces';

interface DiagnosticWithDiffOptions {
	checker: TypeChecker;
	node: Node;
	message: string;
	expectedType: Type;
	receivedType: Type;
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
 * ...
 *
 * @param options - ...
 */
export default (options: DiagnosticWithDiffOptions): Diagnostic => {
	const {checker, node, expectedType, receivedType} = options;
	const position = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart());
	const message = options.message
		.replace('{expectedType}', checker.typeToString(expectedType))
		.replace('{receivedType}', checker.typeToString(receivedType));

	return {
		fileName: node.getSourceFile().fileName,
		message,
		severity: options.severity ?? 'error',
		line: position.line + 1,
		column: position.character,
		diff: {
			expected: checker.typeToString(expectedType, node, typeToStringFormatFlags),
			received: checker.typeToString(receivedType, node, typeToStringFormatFlags)
		}
	};
};
