import {Observable} from 'rxjs';
import {expectType} from '../../../../index.js';
import one from './index.js';

abstract class Foo<T> {
	abstract unicorn(): T;
}

expectType<string>(one('foo', 'bar'));
expectType<number>(one(1, 2));

expectType<Date>(new Date('foo'));
expectType<Promise<number>>(new Promise<number>(resolve => resolve(1)));
expectType<Promise<number | string>>(new Promise<number | string>(resolve => resolve(1)));

expectType<Promise<number>>(Promise.resolve(1));

expectType<Observable<string>>(one<Observable<string>>());

expectType<Observable<string | number> | Observable<Date> | Observable<Symbol>>(
	one<Observable<Date> | Observable<Symbol> | Observable<number | string>>()
);

expectType<Foo<string | Foo<string | number>> | Foo<Date> | Foo<Symbol>>(
	one<Foo<Date> | Foo<Symbol> | Foo<Foo<number | string> | string>>()
);
