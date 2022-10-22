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
