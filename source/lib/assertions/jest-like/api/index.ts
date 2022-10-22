import {assignableTo} from './assignable-to';
import {identicalTo} from './identical-to';

import {notAssignableTo} from './not-assignable-to';
import {notIdenticalTo} from './not-identical-to';

export const api = {
	assignableTo,
	identicalTo,
	not: {
		assignableTo: notAssignableTo,
		identicalTo: notIdenticalTo,
	},
};

export type AssertTypeAPI = typeof api;
