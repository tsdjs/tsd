import {expectType as et} from '../../../../index.js';
import one from './index.js';

et<number>(one(1, 1));
