import {TypeChecker as TSTypeChecker, Type} from '../../../libraries/typescript';

/**
 * Custom interface for the TypeScript `TypeChecker` interface. This exports extra methods that we need
 * inside `tsd`. Use this entity in favour of `ts.TypeChecker`.
 */
export interface TypeChecker extends TSTypeChecker {
	/**
	 * Checks if type `a` is assignable to type `b`.
	 */
	isTypeAssignableTo(a: Type, b: Type): boolean;
	/**
	 * Two types are considered identical when
	 *  - they are both the `any` type,
	 *  - they are the same primitive type,
	 *  - they are the same type parameter,
	 *  - they are union types with identical sets of constituent types, or
	 *  - they are intersection types with identical sets of constituent types, or
	 *  - they are object types with identical sets of members.
	 *
	 * This relationship is bidirectional.
	 * See [here](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#3.11.2) for more information.
	 */
	isTypeIdenticalTo(a: Type, b: Type): boolean;
}
