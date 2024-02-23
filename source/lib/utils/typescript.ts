import ts from '@tsd/typescript';

const resolveCommentHelper = <R extends 'JSDoc' | 'DocComment'>(resolve: R) => {
	type ConditionalResolveReturn = (R extends 'JSDoc' ? Map<string, ts.JSDocTagInfo> : string) | undefined;

	const handler = (checker: ts.TypeChecker, expression: ts.Expression): ConditionalResolveReturn => {
		const reference = ts.isCallLikeExpression(expression)
			? checker.getResolvedSignature(expression)
			: checker.getSymbolAtLocation(expression);

		if (!reference) {
			return;
		}

		switch (resolve) {
			case 'JSDoc': {
				return new Map<string, ts.JSDocTagInfo>(reference.getJsDocTags().map(tag => [tag.name, tag])) as ConditionalResolveReturn;
			}

			case 'DocComment': {
				return ts.displayPartsToString(reference.getDocumentationComment(checker)) as ConditionalResolveReturn;
			}

			default: {
				return undefined;
			}
		}
	};

	return handler;
};

/**
 * Resolve the JSDoc tags from the expression. If these tags couldn't be found, it will return `undefined`.
 *
 * @param checker - The TypeScript type checker.
 * @param expression - The expression to resolve the JSDoc tags for.
 * @return A unique Set of JSDoc tags or `undefined` if they couldn't be resolved.
 */
export const resolveJsDocTags = resolveCommentHelper('JSDoc');

/**
 * Resolve the documentation comment from the expression. If the comment can't be found, it will return `undefined`.
 *
 * @param checker - The TypeScript type checker.
 * @param expression - The expression to resolve the documentation comment for.
 * @return A string of the documentation comment or `undefined` if it can't be resolved.
 */
export const resolveDocComment = resolveCommentHelper('DocComment');

/**
 * Convert a TypeScript expression to a string.
 *
 * @param checker - The TypeScript type checker.
 * @param expression - The expression to convert.
 * @return The string representation of the expression or `undefined` if it couldn't be resolved.
 */
export const expressionToString = (checker: ts.TypeChecker, expression: ts.Expression): string | undefined => {
	if (ts.isCallLikeExpression(expression)) {
		const signature = checker.getResolvedSignature(expression);

		if (!signature) {
			return;
		}

		return checker.signatureToString(signature);
	}

	const symbol = checker.getSymbolAtLocation(expression);

	if (!symbol) {
		return;
	}

	return checker.symbolToString(symbol, expression);
};
