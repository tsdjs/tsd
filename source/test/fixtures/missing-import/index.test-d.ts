import {expectType} from '../../..';
import {LiteralUnion} from '.';

type Pet = LiteralUnion<'dog' | 'cat', string>;

expectType<Pet>('dog');
expectType<Pet>('cat');
expectType<Pet>('unicorn');
