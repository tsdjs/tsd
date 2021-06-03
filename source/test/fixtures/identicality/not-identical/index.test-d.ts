import {expectNotType} from '../../../..';
import concat from '.';

expectNotType<number>(concat('foo', 'bar'));
expectNotType<string | number>(concat('foo', 'bar'));

expectNotType<string>(concat('unicorn', 'rainbow'));

expectNotType<false>(concat('foo', 'bar') as any);
expectNotType<any>(concat('foo', 'bar') as any);
