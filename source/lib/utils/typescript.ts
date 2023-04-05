import type {TypeChecker, Expression, JSDocTagInfo} from '@tsd/typescript';

const {isCallLikeExpression, displayPartsToString} = await import('@tsd/typescript');

const resolveCommentHelper = <R extends 'JSDoc' | 'DocComment'>(resolve: R) => {
	type ConditionalResolveReturn = (R extends 'JSDoc' ? Map<string, JSDocTagInfo> : string) | undefined;

	const handler = (checker: TypeChecker, expression: Expression): ConditionalResolveReturn => {
		const ref = isCallLikeExpression(expression)
			? checker.getResolvedSignature(expression)
			: checker.getSymbolAtLocation(expression);

		if (!ref) {
			return;
		}

		switch (resolve) {
			case 'JSDoc': {
				return new Map<string, JSDocTagInfo>(ref.getJsDocTags().map(tag => [tag.name, tag])) as ConditionalResolveReturn;
			}

			case 'DocComment': {
				return displayPartsToString(ref.getDocumentationComment(checker)) as ConditionalResolveReturn;
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
export const expressionToString = (checker: TypeChecker, expression: Expression): string | undefined => {
	if (isCallLikeExpression(expression)) {
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
