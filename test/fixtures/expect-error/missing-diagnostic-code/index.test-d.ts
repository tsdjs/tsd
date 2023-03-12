import {expectError} from '../../../..';
import one from '.';

// 'Expected an error, but found none.'
expectError(one('foo', 'bar'));

// 'Found an error that tsd does not currently support (`ts2304`), consider creating an issue on GitHub.'
expectError(undeclared = one('foo', 'bar'));
