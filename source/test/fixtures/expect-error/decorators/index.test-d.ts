import {expectError} from '../../../..';
import {Base, classDec, methodDec, getterDec, setterDec, accessorDec, fieldDec, tooFewArguments, badReturnType, factory} from '.';

expectError(@classDec class {}); // 1238, 1270
expectError(() => { // 1238, 1270
	@classDec
	abstract class Test extends Base {}
});

expectError(class extends Base { // 1241
	@methodDec static foo(a: string, b: number) { return true; }
});
expectError(class extends Base { // 1241, 1270
	@methodDec foo() {}
});
expectError(class { // 1241
	@methodDec foo(a: string, b: number) { return true; }
});
expectError(class extends Base { // 1249
	@methodDec override dummy(a: string, b: number): boolean
	dummy(): void
	dummy(a?: string, b?: number) : boolean|void {}
});

expectError(class extends Base { // 1241
	@getterDec static get foo() { return 42; }
});
expectError(class extends Base { // 1241, 1270
	@getterDec get foo() { return "bar"; }
});
expectError(class { // 1241
	@getterDec get foo() { return 42; }
});

expectError(class extends Base { // 1241
	@setterDec static set foo(value: number) {}
});
expectError(class extends Base { // 1241, 1270
	@setterDec set foo(value: string) {}
});
expectError(class { // 1241
	@setterDec set foo(value: number) {}
});

expectError(class extends Base { // 1240, 1270
	@accessorDec static accessor foo = "bar";
});
expectError(class extends Base { // 1240, 1270
	@accessorDec accessor foo = 42;
});
expectError(class { // 1240, 1270
	@accessorDec accessor foo = "bar";
});

expectError(class extends Base { // 1240
	@fieldDec static foo = 42;
});
expectError(class extends Base { // 1240, 1270
	@fieldDec foo = "bar"
});
expectError(class { // 1240
	@fieldDec foo = 42;
});

expectError(class {
	@tooFewArguments foo() {}
});
expectError(class extends Base {
	@badReturnType accessor foo = 42;
})

expectError(class {
	@factory("bar") foo(a: number) {}
});
expectError(class {
	@factory foo(a: number) {}
});
