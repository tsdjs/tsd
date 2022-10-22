import {CallExpression, Node, Type, TypeChecker} from '@tsd/typescript';
import {Diagnostic} from '../../interfaces';
import {makeDiagnostic} from '../../utils';

type Types =
	| {type: Type; argument: Node; diagnostic?: never}
	| {diagnostic: Diagnostic; type?: never; argument?: never};

export function getTypes(node: CallExpression, checker: TypeChecker): Types {
	let type: Type | undefined;
	let value: Type | undefined;

	const typeArgument = node.typeArguments?.[0];
	const valueArgument = node.arguments[0];

	if (typeArgument) {
		type = checker.getTypeFromTypeNode(typeArgument);
	}

	if (valueArgument) {
		value = checker.getTypeAtLocation(valueArgument);
	}

	if (type && value) {
		return {diagnostic: makeDiagnostic(typeArgument ?? node, 'Do not provide a generic type and an argument value at the same time.')};
	}

	if (type && typeArgument) {
		return {type, argument: typeArgument};
	}

	if (value && valueArgument) {
		return {type: value, argument: valueArgument};
	}

	return {diagnostic: makeDiagnostic(node, 'A generic type or an argument value is required.')};
}
