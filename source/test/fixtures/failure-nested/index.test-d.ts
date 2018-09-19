import {expectType} from '../../..';
import one from '.';
import {} from './child.test-d';

expectType<string>(one('foo', 'bar'));
expectType<string>(one(1, 2));
