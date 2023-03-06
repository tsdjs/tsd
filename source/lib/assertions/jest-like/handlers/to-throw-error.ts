import {isNumericLiteral, isRegularExpressionLiteral, isStringLiteral} from '@tsd/typescript';
import {Diagnostic} from '../../../interfaces';
import {JestLikeAssertionNodes, JestLikeContext, JestLikeExpectedError} from '..';
import {getTypes, tryToGetTypes} from '../util';

export const toThrowError = ({typeChecker, expectedErrors}: JestLikeContext, nodes: JestLikeAssertionNodes): Diagnostic[] => {
	const diagnostics: Diagnostic[] = [];

	if (!nodes) {
		return diagnostics;
	}

	for (const node of nodes) {
		const [expectedNode, targetNode] = node;

		const expected = getTypes(expectedNode, typeChecker);

		if (expected.diagnostic) {
			diagnostics.push(expected.diagnostic);
			continue;
		}

		const target = tryToGetTypes(targetNode, typeChecker);

		if (target.diagnostic) {
			diagnostics.push(target.diagnostic);
			continue;
		}

		const start = expected.argument.getStart();
		const end = expected.argument.getEnd();

		const error: JestLikeExpectedError = {node: expected.argument};

		if (target.argument) {
			if (isStringLiteral(target.argument)) {
				error.message = target.argument.text;
			} else if (isNumericLiteral(target.argument)) {
				error.code = Number(target.argument.text);
			} else if (isRegularExpressionLiteral(target.argument)) {
				// eslint-disable-next-line no-eval
				error.regexp = eval(`new RegExp(${target.argument.text})`) as RegExp;
			}
		}

		expectedErrors.set({start, end}, error);
	}

	return diagnostics;
};
