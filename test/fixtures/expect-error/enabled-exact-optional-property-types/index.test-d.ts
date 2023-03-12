import {expectError} from '../../../..';
import {OptionalProperty, setWithOptionalProperty} from '.';

expectError(() => {
	const obj: OptionalProperty = {
		requiredProp: 'required',
		// ts2375 - setting optional property to undefined
		optionalProp: undefined,
	};
});

expectError(setWithOptionalProperty({
	requiredProp: 'required',
	// ts2379 - setting optional property to undefined in a parameter
	optionalProp: undefined,
}));

const obj: OptionalProperty = { requiredProp: 'required' };

// ts2412 - setting optional property to undefined by access
expectError(obj.optionalProp = undefined);
