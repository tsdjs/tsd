import {identicalTo} from './identical-to';
import {notIdenticalTo} from './not-identical-to';

export const api = {
	identicalTo,
	not: {
		identicalTo: notIdenticalTo,
	},
};

export type AssertTypeAPI = typeof api;
