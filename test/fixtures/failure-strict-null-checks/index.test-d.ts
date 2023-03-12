import {expectType} from '../../..';
import aboveZero from '.';

expectType<number>(aboveZero(1));
