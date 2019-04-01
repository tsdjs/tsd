import {expectError} from '../../../..';
import one, {foo, hasProperty} from '.';

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
