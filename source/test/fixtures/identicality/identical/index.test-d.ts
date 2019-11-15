import {expectType} from '../../../..';
import concat from '.';

expectType<string>(concat('foo', 'bar'));
expectType<number>(concat(1, 2));

expectType<any>(concat(1, 2));
expectType<string | number>(concat('unicorn', 'rainbow'));
