import {assertType} from '../../../..';

declare const fooString: string;
declare const fooNumber: number;

// Should pass
assertType<string>().identicalTo<string>();
assertType<string>().identicalTo(fooString);
assertType(fooString).identicalTo<string>();
assertType(fooString).identicalTo(fooString);

assertType<string>().not.identicalTo<number>();
assertType<number>().not.identicalTo(fooString);
assertType(fooString).not.identicalTo<number>();
assertType(fooString).not.identicalTo(fooNumber);

// Shoul fail
assertType<string>().identicalTo<number>();
assertType<number>().identicalTo(fooString);
assertType(fooString).identicalTo<number>();
assertType(fooString).identicalTo(fooNumber);

assertType<string>().not.identicalTo<string>();
assertType<string>().not.identicalTo(fooString);
assertType(fooString).not.identicalTo<string>();
assertType(fooString).not.identicalTo(fooString);
