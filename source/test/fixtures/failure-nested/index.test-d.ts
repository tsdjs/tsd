import {expectType} from '../../..';
import one from '.';
// tslint:disable-next-line:no-import-side-effect
import './child.test-d';

expectType<string>(one('foo', 'bar'));
expectType<string>(one(1, 2));
