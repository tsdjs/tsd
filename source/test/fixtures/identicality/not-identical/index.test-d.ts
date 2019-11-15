import {expectNotType} from '../../../..';
import concat from '.';

expectNotType<number>(concat('foo', 'bar'));
expectNotType<string | number>(concat('foo', 'bar'));

expectNotType<string>(concat('unicorn', 'rainbow'));
