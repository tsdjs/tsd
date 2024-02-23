import {expectError} from '../../../../../index.js';
import one from '../index.js';

expectError(one(true, false));
