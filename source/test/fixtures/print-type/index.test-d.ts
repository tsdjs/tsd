import {printType} from '../../..';
import aboveZero from '.';

printType(aboveZero);
printType(null);
printType(undefined);
printType(null as any);
printType(null as never);
printType(null as unknown);
printType('foo');
