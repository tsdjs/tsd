import {expectType} from '../../..';
import one from './utils';

expectType<string>(one('foo', 'bar'));
expectType<string>(one(1, 2));
