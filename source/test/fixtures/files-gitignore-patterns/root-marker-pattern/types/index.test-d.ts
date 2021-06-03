import {expectType} from '../../../../..';
import concat from '..';

expectType<string>(concat('foo', 'bar'));
expectType<number>(concat(1, 2));
