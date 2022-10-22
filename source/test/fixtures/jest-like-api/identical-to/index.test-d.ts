import {assertType} from '../../../..';

declare const fooString: string;
declare const fooNumber: number;

// Should pass
assertType<string>().identicalTo<string>();
assertType<string>().identicalTo(fooString);
assertType(fooString).identicalTo<string>();
assertType(fooString).identicalTo(fooString);

// Shoul fail
assertType<string>().identicalTo<number>();
assertType<number>().identicalTo(fooString);
assertType(fooString).identicalTo<number>();
assertType(fooString).identicalTo(fooNumber);
