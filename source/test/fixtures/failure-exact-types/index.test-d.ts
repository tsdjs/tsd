import {expectType} from '../../..';
import one, {ones} from '.';

expectType<1>(one);
expectType<number>(one);

expectType<(string | number)[]>(ones);
expectType<(number | string)[]>(ones);
expectType<Array<string | number>>(ones);
