import {expectError} from '../../../..';
import one, {two, three} from '.';

expectError(one(true, true));
expectError(one('foo', 'bar'));

expectError(two('foo', 'bar'));

// Produces multiple type checker errors in a single `expectError` assertion
expectError(three(['a', 'bad']));
