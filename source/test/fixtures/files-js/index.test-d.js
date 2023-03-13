import {expectType, expectError} from '../../..';

/** @type {import('.').Foo} */
let foo = {
	a: 1,
	b: '2',
};

expectType(foo);

expectError(foo = {
	a: '1',
	b: 2,
});

// '')' expected.'
expectError(;
