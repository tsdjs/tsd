import {assertType} from '../../..';

assertType<string>().identicalTo<string>();
assertType<string>().not.identicalTo<number>();

assertType<string>();
assertType<string>().not;

// @ts-expect-error
assertType<string>().prout<number>();
// @ts-expect-error
assertType<string>().nop.identicalTo<number>();
