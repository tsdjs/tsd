import * as tsd from '../../../../index.js';
import {expectType, expectError} from '../../../../index.js';
import one from './index.js';

expectType<number>(one(1, 1));
tsd.expectType<number>(one(1, 1));

expectError(one(true, true));
tsd.expectError(one(true, true));
