import {expectError} from '../../../..';
import {default as one, foo, hasProperty, Options} from '.';

expectError<string>(1);
expectError<string>('fo');

expectError(foo.bar = 'quux');
expectError(foo.quux);

// Ignore errors in deeply nested blocks too
try {
	if (true) {
		expectError(foo.bar = 'quux');
		expectError(foo.quux);
	}
} catch {}

expectError(hasProperty({name: 1}));

expectError(one(1));
expectError(one(1, 2, 3));
expectError({} as Options);
