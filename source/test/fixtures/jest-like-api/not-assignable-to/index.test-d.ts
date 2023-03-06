import {assertType} from '../../../..';

declare const fooString: string;
declare const fooNumber: number;

// Should pass
assertType<string>().not.assignableTo<number>();
assertType<number>().not.assignableTo(fooString);
assertType(fooString).not.assignableTo<number>();
assertType(fooString).not.assignableTo(fooNumber);

// Shoul fail
assertType<string>().not.assignableTo<string>();
assertType<string>().not.assignableTo(fooString);
assertType(fooString).not.assignableTo<string>();
assertType(fooString).not.assignableTo(fooString);

// Should pass with assignable type
assertType<string>().not.assignableTo<'foo'>();
assertType<string>().not.assignableTo('foo');
assertType(fooString).not.assignableTo<'foo'>();
assertType(fooString).not.assignableTo('foo');

// Should fail with reversed order (assignable type)
assertType<'foo'>().not.assignableTo<string>();
assertType<'foo'>().not.assignableTo(fooString);
assertType('foo').not.assignableTo<string>();
assertType('foo').not.assignableTo(fooString);

// Should handle generic, see https://github.com/SamVerschueren/tsd/issues/142
declare const inferrable: <T = 'foo'>() => T;

// Should pass
assertType<string>().not.assignableTo(inferrable());
assertType(inferrable()).not.assignableTo(fooNumber);

// Should fail
assertType<'foo'>().not.assignableTo(inferrable());
assertType(inferrable()).not.assignableTo('foo');

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

// Should fail
assertType<string>().not.assignableTo<any>();
assertType<Bar>().not.assignableTo<number>();
assertType({id: 42, name: 'nyan'}).not.assignableTo<Foo>();

// Should also fail (FI: the following test pass with `subtypeOf`)
assertType<any>().not.assignableTo<string>();
assertType<number>().not.assignableTo<Bar>();
assertType<Baz>().not.assignableTo<Foo>();
