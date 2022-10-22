import {identicalTo} from './identical-to';
import {notIdenticalTo} from './no-identical-to';

export const api = {
	identicalTo,
	not: {
		identicalTo: notIdenticalTo,
	},
};

export type AssertTypeAPI = typeof api;
