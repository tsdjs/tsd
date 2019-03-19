import {expectError} from '../../../..';

expectError<string>(1);
expectError<string>('fo');

const foo: {readonly bar: string} = {
	bar: 'baz'
};

expectError(foo.bar = 'quux');
expectError(foo.quux);

// Ignore errors in deeply nested blocks, too
try {
	if (true) {
		expectError(foo.bar = 'quux');
		expectError(foo.quux);
	}
} catch (e) {}
