import {Program, Node, CallExpression, forEachChild, isCallExpression, Identifier} from '@tsd/typescript';
import {Assertion} from './assertions';
import {Location, Diagnostic} from './interfaces';

// TODO: Use Object.values() when targetting Node.js >= 8
const assertionTypes = new Set<string>(Object.keys(Assertion).map(key => Assertion[key]));

/**
 * Extract all assertions.
 *
 * @param program - TypeScript program.
 */
export const extractAssertions = (program: Program): Map<Assertion, Set<CallExpression>> => {
	const assertions = new Map<Assertion, Set<CallExpression>>();

	/**
	 * Recursively loop over all the nodes and extract all the assertions out of the source files.
	 */
	function walkNodes(node: Node) {
		if (isCallExpression(node)) {
			const text = (node.expression as Identifier).getText();

			// Check if the call type is a valid assertion
			if (assertionTypes.has(text)) {
				const assertion = text as Assertion;

				const nodes = assertions.get(assertion) || new Set<CallExpression>();

				nodes.add(node);

				assertions.set(assertion, nodes);
			}
		}

		forEachChild(node, walkNodes);
	}

	for (const sourceFile of program.getSourceFiles()) {
		walkNodes(sourceFile);
	}

	return assertions;
};

/**
 * Loop over all the error assertion nodes and convert them to a location map.
 *
 * @param assertions - Assertion map.
 */
export const parseErrorAssertionToLocation = (assertions: Map<Assertion, Set<CallExpression>>) => {
	const nodes = assertions.get(Assertion.EXPECT_ERROR);

	const expectedErrors = new Map<Location, Pick<Diagnostic, 'fileName' | 'line' | 'column'>>();

	if (!nodes) {
		// Bail out if we don't have any error nodes
		return expectedErrors;
	}

	// Iterate over the nodes and add the node range to the map
	for (const node of nodes) {
		const location = {
			fileName: node.getSourceFile().fileName,
			start: node.getStart(),
			end: node.getEnd()
		};

		const pos = node
			.getSourceFile()
			.getLineAndCharacterOfPosition(node.getStart());

		expectedErrors.set(location, {
			fileName: location.fileName,
			line: pos.line + 1,
			column: pos.character
		});
	}

	return expectedErrors;
};
