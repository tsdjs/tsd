import {expectType} from '../../..';
import one from '.';

expectType<string>(one('foo', 'bar'));
expectType<string>(one(1, 2));
