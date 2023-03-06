import {assertType} from '../../../..';

type Test<T extends number> = T;

// Should pass
assertType<Test<string>>().toThrowError();
assertType<Test<string>>().toThrowError(2344);
assertType<Test<string>>().toThrowError('does not satisfy the constraint');
assertType<Test<string>>().toThrowError(/^Type 'string'/);

// Should fail
assertType<Test<number>>().toThrowError();
assertType<Test<string>>().toThrowError(2244);
assertType<Test<string>>().toThrowError('poes not satisfy the constraint');
assertType<Test<string>>().toThrowError(/Type 'string'$/);
