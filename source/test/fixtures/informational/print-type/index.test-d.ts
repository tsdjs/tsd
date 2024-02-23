import {printType} from '../../../../index.js';
import {aboveZero, bigType} from './index.js';

printType(aboveZero);
printType(null);
printType(undefined);
printType(null as any);
printType(null as never);
printType(null as unknown);
printType('foo');
printType(bigType);
