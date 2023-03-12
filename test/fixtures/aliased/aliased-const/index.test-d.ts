import * as tsd from '../../../..';
import one from '.';

const x = tsd;
x.expectError(one(true, true));

const y = {z: tsd};
y.z.expectError(one(true, true));
