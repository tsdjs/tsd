import {Program, Node, CallExpression, forEachChild, isCallExpression, isPropertyAccessExpression, SymbolFlags} from '@tsd/typescript';
import {Assertion} from './assertions';
import {Location, Diagnostic} from './interfaces';

const assertionFnNames = new Set<string>(Object.values(Assertion));

/**
 * Extract all assertions.
 *
 * @param program - TypeScript program.
 */
export const extractAssertions = (program: Program): Map<Assertion, Set<CallExpression>> => {
	const assertions = new Map<Assertion, Set<CallExpression>>();
	const checker = program.getTypeChecker();

	/**
	 * Checks if the given node is semantically valid and is an assertion.
	 */
	function handleNode(node: CallExpression) {
		const expression = isPropertyAccessExpression(node.expression) ?
			node.expression.name :
			node.expression;

		const maybeSymbol = checker.getSymbolAtLocation(expression);

		if (!maybeSymbol) {
			// Bail out if a Symbol doesn't exist for this Node
			// This either means a symbol could not be resolved
			// for an identifier, or that the expression is
			// syntactically valid, but not semantically valid.
			return;
		}

		const symbol = maybeSymbol.flags & SymbolFlags.Alias ?
			checker.getAliasedSymbol(maybeSymbol) :
			maybeSymbol;

		const identifier = symbol.getName();

		// Check if the call type is a valid assertion
		if (assertionFnNames.has(identifier)) {
			const assertion = identifier as Assertion;

			const nodes = assertions.get(assertion) ?? new Set<CallExpression>();

			nodes.add(node);

			assertions.set(assertion, nodes);
		}
	}

	/**
	 * Recursively loop over all the nodes and extract all the assertions out of the source files.
	 */
	function walkNodes(node: Node) {
		if (isCallExpression(node)) {
			handleNode(node);
		}

		forEachChild(node, walkNodes);
	}

	for (const sourceFile of program.getSourceFiles()) {
		walkNodes(sourceFile);
	}

	return assertions;
};

export type ExpectedError = Pick<Diagnostic, 'fileName' | 'line' | 'column'> & {code?: number};

/**
 * Loop over all the error assertion nodes and convert them to a location map.
 *
 * @param assertions - Assertion map.
 */
export const parseErrorAssertionToLocation = (
	assertions: Map<Assertion, Set<CallExpression>>
): Map<Location, ExpectedError> => {
	const nodes = assertions.get(Assertion.EXPECT_ERROR);

	const expectedErrors = new Map<Location, ExpectedError>();

	if (!nodes) {
		// Bail out if we don't have any error nodes
		return expectedErrors;
	}

	// Iterate over the nodes and add the node range to the map
	for (const node of nodes) {
		const location = {
			fileName: node.getSourceFile().fileName,
			start: node.getStart(),
			end: node.getEnd() + 1
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
