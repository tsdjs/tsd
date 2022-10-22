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

// Should handle generic, see https://github.com/SamVerschueren/tsd/issues/142
declare const inferrable: <T = 'foo'>() => T;

// Should pass
assertType<string>().not.identicalTo(inferrable());
assertType(inferrable()).not.identicalTo(fooString);

// Should fail
assertType<'foo'>().not.identicalTo(inferrable());
assertType(inferrable()).not.identicalTo('foo');
