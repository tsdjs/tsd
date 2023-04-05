import {expectType} from '../../../index.js';
import one from './index.js';

expectType<string>(await one('foo', 'bar'));
expectType<number>(await one(1, 2));
