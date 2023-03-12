import {expectNotAssignable} from '../../../..';
import concat from '.';

expectNotAssignable<string | number>(concat('foo', 'bar'));
expectNotAssignable<any>(concat('foo', 'bar'));

expectNotAssignable<boolean>(concat('unicorn', 'rainbow'));
expectNotAssignable<symbol>(concat('unicorn', 'rainbow'));
