import {JSDocTagInfo} from '@tsd/typescript';
import {Diagnostic} from '../../../interfaces';
import {Handler} from './handler';
import {makeDiagnostic, tsutils} from '../../../utils';

interface Options {
	filter(tags: Map<string, JSDocTagInfo>): boolean;
	message(signature: string): string;
}

const expectDeprecatedHelper = (options: Options): Handler => {
	return (checker, nodes) => {
		const diagnostics: Diagnostic[] = [];

		if (!nodes) {
			// Bail out if we don't have any nodes
			return diagnostics;
		}

		for (const node of nodes) {
			const argument = node.arguments[0];

			const tags = tsutils.resolveJSDocTags(checker, argument);

			if (!tags || !options.filter(tags)) {
				// Bail out if not tags couldn't be resolved or when the node matches the filter expression
				continue;
			}

			const message = tsutils.expressionToString(checker, argument);

			diagnostics.push(makeDiagnostic(node, options.message(message ?? '?')));
		}

		return diagnostics;
	};
};

/**
 * Asserts that the argument of the assertion is marked as `@deprecated`.
 * If it's not marked as `@deprecated`, an error diagnostic is returned.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectDeprecated` AST nodes.
 * @return List of diagnostics.
 */
export const expectDeprecated = expectDeprecatedHelper({
	filter: tags => !tags.has('deprecated'),
	message: signature => `Expected \`${signature}\` to be marked as \`@deprecated\``
});

/**
 * Asserts that the argument of the assertion is not marked as `@deprecated`.
 * If it's marked as `@deprecated`, an error diagnostic is returned.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectNotDeprecated` AST nodes.
 * @return List of diagnostics.
 */
export const expectNotDeprecated = expectDeprecatedHelper({
	filter: tags => tags.has('deprecated'),
	message: signature => `Expected \`${signature}\` to not be marked as \`@deprecated\``
});
