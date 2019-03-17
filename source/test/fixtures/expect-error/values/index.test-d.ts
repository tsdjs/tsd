import {expectError} from '../../../..';

expectError<string>(1);
expectError<string>('fo');

const foo = {
	bar: 'baz'
};

expectError(foo.quux);
