import {expectError} from '../../../../index.js';
import one, {two, type Three} from './index.js';

expectError(one(true, true));

expectError(one<number>(1, 2));

expectError(two<number, string>(1, 'bar'));

expectError<Three>('');
