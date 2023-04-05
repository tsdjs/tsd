import {printType, expectType} from '../../../../index.js';
import one from './index.js';

printType(one(1, 1));
expectType<string>(one(1, 2));
