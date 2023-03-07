import {expectError} from '../../../..';
import {OptionalProperty} from '.';

expectError(() => {
	const obj: OptionalProperty = {
		requiredProp: 'required',
		// ts2375
		optionalProp: undefined,
	};
});


