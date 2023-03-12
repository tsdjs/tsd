import {expectType} from '../../..';
import aboveZero from '.';

expectType<number | null>(aboveZero(1));
