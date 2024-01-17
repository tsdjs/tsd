export declare class Base {
	dummy(a: string, b: number): boolean;
}

export function classDec<T extends new (a: number, b: boolean) => Base>(value: T, context: ClassDecoratorContext<T>): T;
export function methodDec(value: (this: Base, a: string, b: number) => boolean, context: ClassMethodDecoratorContext<Base, (this:Base, a: string, b: number) => boolean>): (this: Base, a: string, b: number) => boolean
export function getterDec(value: (this: Base) => number, context: ClassGetterDecoratorContext<Base, number>): (this: Base) => number;
export function setterDec(value: (this: Base, value: number) => void, context: ClassSetterDecoratorContext<Base, number>): (this: Base, value: number) => void;
export function accessorDec(value: ClassAccessorDecoratorTarget<Base, string>, context: ClassAccessorDecoratorContext<Base, string>): ClassAccessorDecoratorResult<Base, string>;
export function fieldDec(value: undefined, context: ClassFieldDecoratorContext<Base, number>): (initialValue: number) => number;

export function tooFewArguments(value: Function): void;
export function badReturnType(value: ClassAccessorDecoratorTarget<Base, number>, context: ClassAccessorDecoratorContext<Base, number>): number;

export function factory(arg: number): (value: (a: number) => void, context: ClassMethodDecoratorContext<unknown, (a: number) => void>) => void;
