import {expectType} from '../../..';
import aboveZero from '.';

expectType<number>(aboveZero(1));

function lookupHeadphonesManufacturer(color: 'blue' | 'black'): string {
	if (color === 'blue') {
		return 'beats';
	} else {
		'bose';
	}
}
