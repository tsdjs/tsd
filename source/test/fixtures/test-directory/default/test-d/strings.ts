import {expectType} from '../../../../..';
import one from '..';

expectType<string>(one('foo', 'bar'));
