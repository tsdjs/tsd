import {expectType} from '../../..';
import {LiteralUnion} from '.';

type Pet = LiteralUnion<'dog' | 'cat', string>;

expectType<Pet>('dog' as Pet);
expectType<Pet>('cat' as Pet);
expectType<Pet>('unicorn' as Pet);
