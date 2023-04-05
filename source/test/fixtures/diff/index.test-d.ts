import {expectDocCommentIncludes, expectNotAssignable, expectType} from '../../../index.js';
import foo, { FooFunction, FooInterface, FooType } from './index.js';

// Should pass
expectType<{life: number}>(foo({life: 42}));

// Should fail
expectType<{life?: number}>(foo({life: 42}));
expectType<FooFunction>(() => 42);
expectType<FooType>({} as Required<FooType>);
expectType<Partial<FooInterface>>({} as Required<FooInterface>);

expectNotAssignable<{life?: number}>(foo({life: 42}));

/** This is a comment. */
const commented = 42;

expectDocCommentIncludes<'This is not the same comment!'>(commented);
