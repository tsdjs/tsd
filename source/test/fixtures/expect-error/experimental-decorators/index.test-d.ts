import {expectError} from '../../../..';
import {Base, classDec, methodDec, getterDec, setterDec, propertyDec, parameterDec, tooFewArguments, badReturnType, factory} from '.';

expectError(() => { // 1238, 1270
	@classDec
	class Test {}
});
expectError(() => { // 1238, 1270
	@classDec
	abstract class Test extends Base {}
});

expectError(() => { // 1241
	class Test extends Base {
		@methodDec static foo(a: string, b: number) { return true; }
	}
});
expectError(() => { // 1241
	class Test extends Base {
		@methodDec foo() {}
	}
});
expectError(() => { // 1241
	class Test {
		@methodDec foo(a: string, b: number) { return true; }
	}
});
expectError(() => { // 1249
	class Test extends Base {
		@methodDec override dummy(a: string, b: number): boolean
		dummy(): void
		dummy(a?: string, b?: number) : boolean|void {}
	}
});

expectError(() => { // 1241
	class Test extends Base {
		@getterDec static get foo() { return 42; }
	}
});
expectError(() => { // 1241
	class Test extends Base {
		@getterDec get foo() { return "bar"; }
	}
});
expectError(() => { // 1241
	class Test {
		@getterDec get foo() { return 42; }
	}
});

expectError(() => { // 1241
	class Test extends Base {
		@setterDec static set foo(value: number) {}
	}
});
expectError(() => { // 1241
	class Test extends Base {
		@setterDec static set foo(value: string) {}
	}
});
expectError(() => { // 1241
	class Test {
		@setterDec set foo(value: number) {}
	}
});

expectError(() => { // 1240
	class Test extends Base {
		@propertyDec static foo = 42;
	}
});
expectError(() => { // 1240
	class Test {
		@propertyDec foo = 42;
	}
});

expectError(() => { // 1239
	class Test extends Base {
		static foo(@parameterDec a: number) {}
	}
});
expectError(() => { // 1241
	class Test {
		foo(@parameterDec a: number) {}
	}
});


expectError(() => {
	class Test {
		@tooFewArguments foo() {}
	}
});
expectError(() => { // 1271
	class Test extends Base {
		@badReturnType accessor foo = 42;
	}
})

expectError(() => {
	class Test {
		@factory("bar") foo(a: number) {}
	}
});
expectError(() => {
	class Test {
		@factory foo(a: number) {}
	}
});
