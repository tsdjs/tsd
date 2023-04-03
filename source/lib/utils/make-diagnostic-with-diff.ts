import {type Node, type Type, type TypeChecker, TypeFormatFlags} from '@tsd/typescript';
import {type Diagnostic} from '../interfaces.js';

type DiagnosticWithDiffOptions = {
	checker: TypeChecker;
	node: Node;
	message: string;
	expectedType: Type | string;
	receivedType: Type | string;
	severity?: Diagnostic['severity'];
};

const typeToStringFormatFlags
	= TypeFormatFlags.NoTruncation
	| TypeFormatFlags.WriteArrayAsGenericType
	| TypeFormatFlags.UseStructuralFallback
	| TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
	| TypeFormatFlags.NoTypeReduction
	| TypeFormatFlags.AllowUniqueESSymbolType
	| TypeFormatFlags.InArrayType
	| TypeFormatFlags.InElementType
	| TypeFormatFlags.InFirstTypeArgument
	| TypeFormatFlags.InTypeAlias;

/**
 * Create a diagnostic with type error diffs from the given `options`, see {@link DiagnosticWithDiffOptions}.
 *
 * @param options - Options for creating the diagnostic.
 * @returns Diagnostic with diffs
 */
const makeDiagnosticWithDiff = (options: DiagnosticWithDiffOptions): Diagnostic => {
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
			received: typeof receivedType === 'string' ? receivedType : checker.typeToString(receivedType, node, typeToStringFormatFlags),
		},
	};
};

export default makeDiagnosticWithDiff;
