import {expectError} from '../../../../..';
import one from '..';

expectError(one(true, false));
