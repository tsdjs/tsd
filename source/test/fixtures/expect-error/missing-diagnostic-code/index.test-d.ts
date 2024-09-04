import {expectError} from '../../../..';
import one from '.';

// 'Expected an error, but found none.'
expectError(one('foo', 'bar'));

// 'Found an error that tsd does not currently support (`ts2304`), consider creating an issue on GitHub.'
expectError(undeclared = one('foo', 'bar'));

// ts2719
interface T {}
declare const a: T;
expectError(class Foo<T> {
	x: T;
	constructor(a: T) {
		this.x = a;
	}
	fn() {
		this.x = a;
	}
})
