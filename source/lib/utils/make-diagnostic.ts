import {Node} from '@tsd/typescript';
import {Diagnostic} from '../interfaces';

/**
 * Create a diagnostic from the given `node`, `message` and optional `severity`.
 *
 * @param node - The TypeScript Node where this diagnostic occurs.
 * @param message - Message of the diagnostic.
 * @param severity - Severity of the diagnostic.
 */
export default (node: Node, message: string, severity: 'error' | 'warning' = 'error'): Diagnostic => {
	const position = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart());

	return {
		fileName: node.getSourceFile().fileName,
		message,
		severity,
		line: position.line + 1,
		column: position.character,
	};
};
