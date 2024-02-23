import {expectType} from '../../../index.js';
import {LiteralUnion} from './index.js';

type Pet = LiteralUnion<'dog' | 'cat', string>;

expectType<Pet>('dog' as Pet);
expectType<Pet>('cat' as Pet);
expectType<Pet>('unicorn' as Pet);
