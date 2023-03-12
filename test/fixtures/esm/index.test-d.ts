import {expectType} from '../../..';
import one from './index.js';

expectType<string>(one('foo', 'bar'));
