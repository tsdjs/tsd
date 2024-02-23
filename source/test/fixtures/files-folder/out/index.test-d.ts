import {expectType} from '../../../../index.js';
import concat from './index.js';

expectType<string>(concat('foo', 'bar'));
expectType<number>(concat(1, 2));
