import {expectType} from '../../..';
import one from '.';
import './child.test-d'; // tslint:disable-line:no-import-side-effect

expectType<string>(one('foo', 'bar'));
expectType<string>(one(1, 2));
