import {assertType} from '../../../..';

declare const fooString: string;
declare const fooNumber: number;

// Should pass
assertType<string>().not.identicalTo<number>();
assertType<number>().not.identicalTo(fooString);
assertType(fooString).not.identicalTo<number>();
assertType(fooString).not.identicalTo(fooNumber);

// Shoul fail
assertType<string>().not.identicalTo<string>();
assertType<string>().not.identicalTo(fooString);
assertType(fooString).not.identicalTo<string>();
assertType(fooString).not.identicalTo(fooString);
