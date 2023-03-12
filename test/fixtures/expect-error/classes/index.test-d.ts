import {expectError} from '../../../..';
import {Foo} from '.';

const numberFoo = new Foo<number>();

expectError(numberFoo.bar());

expectError(class extends Foo<string> {
	bar(): void {}
});

expectError(class extends Foo<string> {
	override foo(): void {}
});
