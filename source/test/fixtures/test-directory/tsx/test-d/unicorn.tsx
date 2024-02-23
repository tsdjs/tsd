import * as React from 'react';
import {expectType, expectError} from '../../../../../index.js';
import {Unicorn} from '../index.js';

expectType<JSX.Element>(<Unicorn rainbow='🌈' />);

expectError(<Unicorn foo='bar' />);
