import {expectError} from '../../../..';
import one from '.';

expectError(one(true, true));

expectError(one<number>(1, 2));
