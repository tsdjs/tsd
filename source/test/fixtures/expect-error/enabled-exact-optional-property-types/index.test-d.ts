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
	optionalProp: undefined,
}));
