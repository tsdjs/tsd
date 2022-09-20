import {expectType} from '../../..';
import foo, { FooFunction, FooInterface, FooType } from '.';

// Should pass
expectType<{life: number}>(foo({life: 42}));

// Should fail
expectType<{life?: number}>(foo({life: 42}));
expectType<FooFunction>(() => 42);
expectType<FooType>({} as Required<FooType>);
expectType<Partial<FooInterface>>({} as Required<FooInterface>);
