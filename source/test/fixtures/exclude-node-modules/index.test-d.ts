import {expectType} from '../../../index.js';
import aboveZero from './index.js';

expectType<number | null>(aboveZero(1));
