import {expectError} from '../../../..';
import {getMethod} from '.';

const method = getMethod();
expectError(method === 1);
expectError(method !== 1);
expectError(method == 1);
expectError(method != 1);
expectError(method === 'DELETE');

method === 1;
expectError(method === 'GET');
