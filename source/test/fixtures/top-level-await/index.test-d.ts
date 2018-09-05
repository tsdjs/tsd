import {expectType} from '../../..';
import one from '.';

expectType<string>(await one('foo', 'bar'));
expectType<number>(await one(1, 2));
