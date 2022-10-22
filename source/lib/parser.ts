import {Program, Node, CallExpression, forEachChild, isCallExpression, isPropertyAccessExpression, SymbolFlags} from '@tsd/typescript';
import {JestLikeAssertion, JestLikeAssertions} from './assertions/jest-like';
import {Assertion} from './assertions/tsd';
import {Location, Diagnostic} from './interfaces';
import {makeDiagnostic} from './utils';

const assertionFnNames = new Set<string>(Object.values(Assertion));

type Assertions = {
	assertions: Map<Assertion, Set<CallExpression>>;
	jestLikeAssertions: JestLikeAssertions;
	diagnostics: Diagnostic[];
};

/**
 * Extract all assertions.
 *
 * @param program - TypeScript program.
 */
export const extractAssertions = (program: Program): Assertions => {
	const jestLikeAssertions: JestLikeAssertions = new Map();
	const assertions = new Map<Assertion, Set<CallExpression>>();
	const checker = program.getTypeChecker();
	const diagnostics: Diagnostic[] = [];

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

		// Check for jest-like assertion
		if (identifier === 'assertType') {
			assertTypeHandler(node);
		}
	}

	function assertTypeHandler(expectedNode: CallExpression) {
		// Try to find the right side assignement
		const targetNode = expectedNode.parent.parent.getChildren().find(isPropertyAccessExpression);

		if (!targetNode) {
			diagnostics.push(makeDiagnostic(expectedNode, 'Missing right side method, expected something like `assertType(\'hello\').assignableTo<string>()`.'));
			return;
		}

		const assertMethodSymbol = checker.getSymbolAtLocation(targetNode);

		if (!assertMethodSymbol) {
			diagnostics.push(makeDiagnostic(targetNode, 'Missing right side method, expected something like `assertType(\'hello\').assignableTo<string>()`.'));
			return;
		}

		const assertMethodName = assertMethodSymbol.getName();

		if (assertMethodName !== 'not') {
			const nodes = jestLikeAssertions.get(assertMethodName as JestLikeAssertion) ?? new Set();

			nodes.add([expectedNode, targetNode.parent as CallExpression]);

			jestLikeAssertions.set(assertMethodName as JestLikeAssertion, nodes);
			return;
		}

		const maybeTargetNode = targetNode.parent;

		if (!isPropertyAccessExpression(maybeTargetNode)) {
			diagnostics.push(makeDiagnostic(maybeTargetNode, 'Missing right side method, expected something like `assertType(\'hello\').not.assignableTo<string>()`.'));
			return;
		}

		const maybeTargetType = checker.getTypeAtLocation(maybeTargetNode.name);
		const maybeTargetName = maybeTargetType.symbol.getName() as JestLikeAssertion;

		const nodes = jestLikeAssertions.get(maybeTargetName) ?? new Set();

		nodes.add([expectedNode, maybeTargetNode.parent as CallExpression]);

		jestLikeAssertions.set(maybeTargetName, nodes);
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

	return {assertions, jestLikeAssertions, diagnostics};
};

export type ExpectedError = Pick<Diagnostic, 'fileName' | 'line' | 'column'>;

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
