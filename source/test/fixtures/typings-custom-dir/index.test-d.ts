import {expectType} from '../../..';
import one from './index';

expectType<string>(one('foo', 'bar'));
expectType<string>(one(1, 2));
