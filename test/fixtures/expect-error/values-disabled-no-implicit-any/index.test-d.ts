import {expectError} from '../../../..';
import {hasProperty} from '.';

// Only a void function can be called with the 'new' keyword.
expectError(new hasProperty({name: 'foo'}));
