import {assertType} from '../../../..';

declare const fooString: string;
declare const fooNumber: number;

// Shoul pass
assertType<string>().not.subtypeOf<number>();
assertType<number>().not.subtypeOf(fooString);
assertType(fooString).not.subtypeOf<number>();
assertType(fooString).not.subtypeOf(fooNumber);

// Should fail
assertType<string>().not.subtypeOf<string>();
assertType<string>().not.subtypeOf(fooString);
assertType(fooString).not.subtypeOf<string>();
assertType(fooString).not.subtypeOf(fooString);

// Should pass with reversed order (assignable type)
assertType<string>().not.subtypeOf<'foo'>();
assertType<string>().not.subtypeOf('foo');
assertType(fooString).not.subtypeOf<'foo'>();
assertType(fooString).not.subtypeOf('foo');

// Should fail with assignable type
assertType<'foo'>().not.subtypeOf<string>();
assertType<'foo'>().not.subtypeOf(fooString);
assertType('foo').not.subtypeOf<string>();
assertType('foo').not.subtypeOf(fooString);

// Should handle generic, see https://github.com/SamVerschueren/tsd/issues/142
declare const inferrable: <T = 'foo'>() => T;

// Should pass
assertType<string>().not.subtypeOf(inferrable());
assertType(inferrable()).not.subtypeOf(fooNumber);

// Should fail
assertType<'foo'>().not.subtypeOf(inferrable());
assertType(inferrable()).not.subtypeOf('foo');

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

// Should pass (FI: the following test fail with `not.assignableTo`)
assertType<any>().not.subtypeOf<string>();
assertType<number>().not.subtypeOf<Bar>();
assertType<Baz>().not.subtypeOf<Foo>();

// Should fail
assertType<string>().not.subtypeOf<any>();
assertType<Bar>().not.subtypeOf<number>();
assertType({id: 42, name: 'nyan'}).not.subtypeOf<Foo>();
