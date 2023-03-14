import {printType, expectType} from '../../../..';
import one from '.';

printType(one(1, 1));
expectType<string>(one(1, 2));
