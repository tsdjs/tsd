import {assertType} from '../../../..';

// Must fail on invalid syntax
assertType<string>();
assertType<string>().not;

// @ts-expect-error
assertType<string>().prout<number>();
// @ts-expect-error
assertType<string>().nop.identicalTo<number>();

// Shoul fail on missing generic type or argument
assertType().identicalTo<number>();
assertType<string>().identicalTo();
assertType().not.identicalTo<number>();
assertType<string>().not.identicalTo();

// Shoul fail if both generic type and argument was provided
assertType<string>('foo').identicalTo<string>();
assertType<string>().identicalTo<string>('foo');
assertType<string>('foo').not.identicalTo<string>();
assertType<string>().not.identicalTo<string>('foo');
