import {expectError} from '../../../../index.js';
import {Foo} from './index.js';

const numberFoo = new Foo<number>();

expectError(numberFoo.bar());

expectError(class extends Foo<string> {
	bar(): void {}
});

expectError(class extends Foo<string> {
	override foo(): void {}
});
