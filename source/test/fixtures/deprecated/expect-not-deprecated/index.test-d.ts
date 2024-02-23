import {expectNotDeprecated} from '../../../../index.js';
import concat, {Unicorn, Options} from './index.js';

// Methods
expectNotDeprecated(concat('foo', 'bar'));
expectNotDeprecated(concat(1, 2));

// Properties
const options: Options = {
	separator: ',',
	delimiter: '/'
};

expectNotDeprecated(options.separator);
expectNotDeprecated(options.delimiter);

// ENUM
expectNotDeprecated(Unicorn.UNICORN);
expectNotDeprecated(Unicorn.RAINBOW);

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

expectNotDeprecated(UnicornClass);
expectNotDeprecated(RainbowClass);
