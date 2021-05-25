import {expectError} from '../../../..';
import {Foo} from '.';

const numberFoo = new Foo<number>();

expectError(numberFoo.bar());
