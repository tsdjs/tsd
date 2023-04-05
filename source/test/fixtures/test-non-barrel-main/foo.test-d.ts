import {expectType} from '../../../index.js';
import one from './foo';

expectType<string>(one('foo', 'bar'));
expectType<number>(one(1, 2));
