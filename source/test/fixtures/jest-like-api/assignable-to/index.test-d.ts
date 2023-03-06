import {assertType} from '../../../..';

declare const fooString: string;
declare const fooNumber: number;

// Should pass
assertType<string>().assignableTo<string>();
assertType<string>().assignableTo(fooString);
assertType(fooString).assignableTo<string>();
assertType(fooString).assignableTo(fooString);

// Shoul fail
assertType<string>().assignableTo<number>();
assertType<number>().assignableTo(fooString);
assertType(fooString).assignableTo<number>();
assertType(fooString).assignableTo(fooNumber);

// Should pass with assignable type
assertType<'foo'>().assignableTo<string>();
assertType<'foo'>().assignableTo(fooString);
assertType('foo').assignableTo<string>();
assertType('foo').assignableTo(fooString);

// Should fail with reversed order (assignable type)
assertType<string>().assignableTo<'foo'>();
assertType<string>().assignableTo('foo');
assertType(fooString).assignableTo<'foo'>();
assertType(fooString).assignableTo('foo');

// Should handle generic, see https://github.com/SamVerschueren/tsd/issues/142
declare const inferrable: <T = 'foo'>() => T;

// Should pass
assertType<'foo'>().assignableTo(inferrable());
assertType(inferrable()).assignableTo('foo');

// Should fail
assertType<string>().assignableTo(inferrable());
assertType(inferrable()).assignableTo(fooNumber);

/**
The assignment compatibility and subtyping rules differ only in that

- the Any type is assignable to, but not a subtype of, all types,
- the primitive type Number is assignable to, but not a subtype of, all enum types, and
- an object type without a particular property is assignable to an object type in which that property is optional.

See https://github.com/microsoft/TypeScript/blob/v4.2.4/doc/spec-ARCHIVED.md#3114-assignment-compatibility
*/
enum Bar { B, A, R }
type Foo = {id: number; name?: string | undefined};

class Baz {
	readonly id: number = 42;
}

// Should pass
assertType<string>().assignableTo<any>();
assertType<Bar>().assignableTo<number>();
assertType({id: 42, name: 'nyan'}).assignableTo<Foo>();

// Should also pass (FI: the following test fail with `subtypeOf`)
assertType<any>().assignableTo<string>();
assertType<number>().assignableTo<Bar>();
assertType<Baz>().assignableTo<Foo>();
