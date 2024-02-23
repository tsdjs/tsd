import {expectNotType} from '../../../../index.js';
import concat from './index.js';

expectNotType<number>(concat('foo', 'bar'));
expectNotType<string | number>(concat('foo', 'bar'));

expectNotType<string>(concat('unicorn', 'rainbow'));

expectNotType<false>(concat('foo', 'bar') as any);
expectNotType<any>(concat('foo', 'bar') as any);
