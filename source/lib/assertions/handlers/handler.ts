import type {CallExpression, TypeChecker} from '@tsd/typescript';
import type {Diagnostic} from '../../interfaces.js';

/**
 * A handler is a method which accepts the TypeScript type checker together with a set of assertion nodes. The type checker
 * can be used to retrieve extra type information from these nodes in order to determine a list of diagnostics.
 *
 * @param typeChecker - The TypeScript type checker.
 * @param nodes - List of nodes.
 * @returns List of diagnostics.
 */
export type Handler = (typeChecker: TypeChecker, nodes: Set<CallExpression>) => Diagnostic[];
