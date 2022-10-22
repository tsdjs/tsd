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
