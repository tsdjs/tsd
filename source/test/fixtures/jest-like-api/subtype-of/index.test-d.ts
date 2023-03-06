import {assertType} from '../../../..';

declare const fooString: string;
declare const fooNumber: number;

// Should pass
assertType<string>().subtypeOf<string>();
assertType<string>().subtypeOf(fooString);
assertType(fooString).subtypeOf<string>();
assertType(fooString).subtypeOf(fooString);

// Shoul fail
assertType<string>().subtypeOf<number>();
assertType<number>().subtypeOf(fooString);
assertType(fooString).subtypeOf<number>();
assertType(fooString).subtypeOf(fooNumber);

// Should pass with assignable type
assertType<'foo'>().subtypeOf<string>();
assertType<'foo'>().subtypeOf(fooString);
assertType('foo').subtypeOf<string>();
assertType('foo').subtypeOf(fooString);

// Should fail with reversed order (assignable type)
assertType<string>().subtypeOf<'foo'>();
assertType<string>().subtypeOf('foo');
assertType(fooString).subtypeOf<'foo'>();
assertType(fooString).subtypeOf('foo');

// Should handle generic, see https://github.com/SamVerschueren/tsd/issues/142
declare const inferrable: <T = 'foo'>() => T;

// Should pass
assertType<'foo'>().subtypeOf(inferrable());
assertType(inferrable()).subtypeOf('foo');

// Should fail
assertType<string>().subtypeOf(inferrable());
assertType(inferrable()).subtypeOf(fooNumber);

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
assertType<string>().subtypeOf<any>();
assertType<Bar>().subtypeOf<number>();
assertType({id: 42, name: 'nyan'}).subtypeOf<Foo>();

// Should fail (FI: the following test pass with `assignableTo`)
assertType<any>().subtypeOf<string>();
assertType<number>().subtypeOf<Bar>();
assertType<Baz>().subtypeOf<Foo>();
