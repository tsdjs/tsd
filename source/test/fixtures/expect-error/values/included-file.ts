import {expectError} from '../../../..';

expectError<string>('fo');
expectError<string>(1);
