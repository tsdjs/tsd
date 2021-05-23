import {expectError} from '../../../..';
import one, {three} from '.';

expectError(one(true, true));
expectError(one('foo', 'bar'));

// Produces multiple type checker errors in a single `expectError` assertion
expectError(three(['a', 'bad']));
