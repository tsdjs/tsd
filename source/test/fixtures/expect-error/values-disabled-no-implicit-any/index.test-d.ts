import {expectError} from '../../../../index.js';
import {hasProperty} from './index.js';

// Only a void function can be called with the 'new' keyword.
expectError(new hasProperty({name: 'foo'}));
