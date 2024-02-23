import {expectType} from '../../../../../index.js';
import one from '../index.js';

expectType<number>(one(1, 2));
