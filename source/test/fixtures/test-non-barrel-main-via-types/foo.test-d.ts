import {expectType} from '../../..';
import one from './foo';

expectType<string>(one('foo', 'bar'));
expectType<number>(one(1, 2));
