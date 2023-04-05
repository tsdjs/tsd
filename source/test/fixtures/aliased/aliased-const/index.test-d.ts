import * as tsd from '../../../../index.js';
import one from './index.js';

const x = tsd;
x.expectError(one(true, true));

const y = {z: tsd};
y.z.expectError(one(true, true));
