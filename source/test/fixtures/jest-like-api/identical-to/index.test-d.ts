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

// Should handle generic, see https://github.com/SamVerschueren/tsd/issues/142
declare const inferrable: <T = 'foo'>() => T;

// Should pass
assertType<'foo'>().identicalTo(inferrable());
assertType(inferrable()).identicalTo('foo');

// Should fail
assertType<string>().identicalTo(inferrable());
assertType(inferrable()).identicalTo(fooString);
