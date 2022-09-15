import {expectError, expectType} from '../../../..';
import one, {two, inferrable} from '.';

expectError(one(true, true));

expectError(one<number>(1, 2));

expectError(two<number, string>(1, 'bar'));

// expectError(expectType<number>(inferrable<true>()));

// expectError(expectType<number>(inferrable()));
