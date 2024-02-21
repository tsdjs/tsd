export declare class Base {
	dummy(a: string, b: number): boolean;
}

export function classDec<T extends new (a: number, b: boolean) => Base>(constructor: T): T;
export function methodDec(target: Base, propertyKey: string, descriptor: TypedPropertyDescriptor<(a: number, b: number) => boolean>): void
export function getterDec(target: Base, propertyKey: string, descriptor: TypedPropertyDescriptor<number>): void;
export function setterDec(target: Base, propertyKey: string, descriptor: TypedPropertyDescriptor<number>): void;
export function propertyDec(target: Base, propertyKey: string): void;
export function parameterDec(target: Base, propertyKey: string, parameterIndex: number): void;

export function tooFewArguments(target: Base): PropertyDescriptor;
export function badReturnType(target: Base, propertyKey: string, descriptor: PropertyDescriptor): number;

export function factory(arg: number): (target: Base, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
