import {expectAssignable} from '../../../..';
import concat from '.';

expectAssignable<string | number>(concat('foo', 'bar'));
expectAssignable<string | number>(concat(1, 2));
expectAssignable<any>(concat(1, 2));

expectAssignable<boolean>(concat('unicorn', 'rainbow'));
