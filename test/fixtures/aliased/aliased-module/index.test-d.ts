import * as tsd from '../../../..';
import {expectType, expectError} from '../../../..';
import one from '.';

expectType<number>(one(1, 1));
tsd.expectType<number>(one(1, 1));

expectError(one(true, true));
tsd.expectError(one(true, true));
