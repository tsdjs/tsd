import {expectError} from '../../../..';
import './included-file';

expectError<string>(1);
expectError<string>('fo');
