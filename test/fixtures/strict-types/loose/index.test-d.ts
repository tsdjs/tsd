import {Observable} from 'rxjs';
import {expectType} from '../../../..';
import one from '.';

expectType<string>('cat');

expectType<string | number>(one('foo', 'bar'));
expectType<string | number>(one(1, 2));

expectType<Date | string>(new Date('foo'));
expectType<Promise<number | string>>(new Promise<number>(resolve => resolve(1)));
expectType<Promise<number | string> | string>(new Promise<number | string>(resolve => resolve(1)));

expectType<Promise<string | number>>(Promise.resolve(1));

expectType<Observable<string | number>>(
	one<Observable<string>>()
);

expectType<Observable<string | number> | Observable<string | number | boolean>>(
	one<Observable<string | number> | Observable<string>>()
);

abstract class Foo<T> {
	abstract unicorn(): T;
}

expectType<Foo<string | Foo<string | number>> | Foo<Date> | Foo<Symbol>>(
	one<Foo<Date> | Foo<Symbol> | Foo<Foo<number> | string>>()
);

expectType<string | number>(one<any>());

expectType<Observable<string | number> | Observable<string | number | boolean> | Observable<any>>(
	one<Observable<string | number> | Observable<string | number | boolean> | Observable<string>>()
);
