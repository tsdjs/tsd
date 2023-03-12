export type OptionalProperty = {
	requiredProp: 'required';
	optionalProp?: 'optional';
};

export function setWithOptionalProperty(obj: OptionalProperty): any;
