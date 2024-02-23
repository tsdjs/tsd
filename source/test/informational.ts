import test from 'ava';
import {verifyTsd} from './_utils.js';

test('print type', verifyTsd, 'informational/print-type', [
	[4, 0, 'warning', 'Type for expression `aboveZero` is: `(foo: number) => number | null`'],
	[5, 0, 'warning', 'Type for expression `null` is: `null`'],
	[6, 0, 'warning', 'Type for expression `undefined` is: `undefined`'],
	[7, 0, 'warning', 'Type for expression `null as any` is: `any`'],
	[8, 0, 'warning', 'Type for expression `null as never` is: `never`'],
	[9, 0, 'warning', 'Type for expression `null as unknown` is: `unknown`'],
	[10, 0, 'warning', 'Type for expression `\'foo\'` is: `"foo"`'],
	[11, 0, 'warning', 'Type for expression `bigType` is: `{ prop1: SuperTypeWithAnExessiveLongNameThatTakesUpTooMuchSpace; prop2: SuperTypeWithAnExessiveLongNameThatTakesUpTooMuchSpace; prop3: SuperTypeWithAnExessiveLongNameThatTakesUpTooMuchSpace; prop4: SuperTypeWithAnExessiveLongNameThatTakesUpTooMuchSpace; prop5: SuperTypeWithAnExessiveLongNameThatTakesUpTooMuchSpace; prop6: SuperTypeWithAnExessiveLongNameThatTakesUpTooMuchSpace; prop7: SuperTypeWithAnExessiveLongNameThatTakesUpTooMuchSpace; prop8: SuperTypeWithAnExessiveLongNameThatTakesUpTooMuchSpace; prop9: SuperTypeWithAnExessiveLongNameThatTakesUpTooMuchSpace; }`'],
]);

test('expect doc comment includes', verifyTsd, 'informational/expect-doc-comment', [
	[5, 0, 'error', 'Documentation comment for expression `noDocComment` not found.'],
	[10, 0, 'error', 'Expected documentation comment for expression `foo` not specified.'],
	[11, 0, 'error', 'Expected documentation comment for expression `foo` should be a string literal.'],
	[12, 0, 'error', 'Documentation comment `FooBar` for expression `foo` does not include expected `BarFoo`.'],
]);
