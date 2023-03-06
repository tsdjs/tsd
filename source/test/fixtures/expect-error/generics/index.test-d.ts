import {expectError, expectType} from '../../../..';
import one, {two, type Three} from '.';

expectError(one(true, true));

expectError(one<number>(1, 2));

expectError(two<number, string>(1, 'bar'));

expectError<Three>('');
