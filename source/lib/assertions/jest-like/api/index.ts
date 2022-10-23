import {assignableTo} from './assignable-to';
import {identicalTo} from './identical-to';
import {subtypeOf} from './subtype-of';

import {notAssignableTo} from './not-assignable-to';
import {notIdenticalTo} from './not-identical-to';
import {notSubtypeOf} from './not-subtype-of';

import {toThrowError} from './to-throw-error';

export const api = {
	assignableTo,
	identicalTo,
	subtypeOf,
	toThrowError,
	not: {
		assignableTo: notAssignableTo,
		identicalTo: notIdenticalTo,
		subtypeOf: notSubtypeOf
	},
};

export type AssertTypeAPI = typeof api;
