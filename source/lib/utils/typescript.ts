import {TypeChecker, Expression, isCallLikeExpression, JSDocTagInfo} from '../../../libraries/typescript/lib/typescript';

/**
 * Resolve the JSDoc tags from the expression. If these tags couldn't be found, it will return `undefined`.
 *
 * @param checker - The TypeScript type checker.
 * @param expression - The expression to resolve the JSDoc tags for.
 * @return A unique Set of JSDoc tags or `undefined` if they couldn't be resolved.
 */
export const resolveJSDocTags = (checker: TypeChecker, expression: Expression): Map<string, JSDocTagInfo> | undefined => {
	const ref = isCallLikeExpression(expression)
		? checker.getResolvedSignature(expression)
		: checker.getSymbolAtLocation(expression);

	if (!ref) {
		return;
	}

	return new Map<string, JSDocTagInfo>(ref.getJsDocTags().map(tag => [tag.name, tag]));
};

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
