import {expectDeprecated} from '../../../../index.js';
import concat, {Unicorn, Options} from './index.js';

// Methods
expectDeprecated(concat('foo', 'bar'));
expectDeprecated(concat(1, 2));

// Properties
const options: Options = {
	separator: ',',
	delimiter: '/'
};

expectDeprecated(options.separator);
expectDeprecated(options.delimiter);

// ENUM
expectDeprecated(Unicorn.UNICORN);
expectDeprecated(Unicorn.RAINBOW);

// Classes
/**
 * @deprecated
 */
class UnicornClass {
	readonly key = '🦄';
}

class RainbowClass {
	readonly key = '🌈';
}

expectDeprecated(UnicornClass);
expectDeprecated(RainbowClass);
