import {expectError} from '../../../..';
import {default as one, atLeastOne, foo, getFoo, HasKey, hasProperty, MyClass, Options} from '.';

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

expectError(atLeastOne())

expectError(getFoo({bar: 1} as HasKey<'bar'>));

const bar = 1;
expectError(bar());
expectError(new bar());

expectError(MyClass());

// 'new' expression, whose target lacks a construct signature, implicitly has an 'any' type.
expectError(new hasProperty({name: 'foo'}));
