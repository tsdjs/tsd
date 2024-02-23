import {expectType} from '../../../index.js';
import one from './index.js';

expectType<string>(one('foo', 'bar'));
expectType<string>(one(1, 2));
