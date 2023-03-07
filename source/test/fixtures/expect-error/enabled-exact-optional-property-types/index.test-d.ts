import {expectError} from '../../../..';
import {OptionalProperty, setWithOptionalProperty} from '.';

expectError(() => {
	const obj: OptionalProperty = {
		requiredProp: 'required',
		// ts2375
		optionalProp: undefined,
	};
});

expectError(setWithOptionalProperty({
	requiredProp: 'required',
	// ts2379
	optionalProp: undefined,
}));

const obj: OptionalProperty = { requiredProp: 'required' };

// ts2412
expectError(obj.optionalProp = undefined);
