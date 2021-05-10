import {expectType} from '../../../..';
import append from '.';

const parent = document.createElement('div');
const child = document.createElement('p');

expectType<void>(append(parent, child));
