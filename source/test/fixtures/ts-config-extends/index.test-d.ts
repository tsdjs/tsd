import {expectType} from '../../../index.js';
import aboveZero from './index.js';

expectType<number>(aboveZero(1));

function lookupHeadphonesManufacturer(color: 'blue' | 'black'): string {
	if (color === 'blue') {
		return 'beats';
	} else {
		'bose';
	}
}
