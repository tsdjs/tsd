import {expectType} from '../../../index.js';

// Identifier `bar` has no Symbol
const anyCall = (foo: any) => foo.bar();

// Fails with `Cannot read properties of undefined (reading 'flags')` in 0.24.0
expectType<any>(anyCall('foo'));
