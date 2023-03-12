import {expectType} from '../../..';
import append from '.';

const parent = document.createElement('div');
const child = document.createElement('p');

expectType<void>(append(parent, child));

const elementsCollection = document.getElementsByClassName('foo');
expectType<HTMLCollectionOf<Element>>(elementsCollection);
expectType<() => IterableIterator<Element>>(elementsCollection[Symbol.iterator]);
