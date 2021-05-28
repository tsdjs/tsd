import {expectError} from '../../../..';
import one, {two} from '.';

expectError(one(true, true));

expectError(one<number>(1, 2));

expectError(two<number, string>(1, 'bar'));
