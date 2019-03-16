import {expectError} from '../../../..';

expectError<string>(1);
expectError<string>('fo');
