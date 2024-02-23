import React from 'react';
import {expectType, expectError} from '#tsd';
import {Unicorn} from './index.js';

expectType<JSX.Element>(<Unicorn unicorn={1} rainbow='🌈' />);

expectError(<Unicorn foo='bar' />);
expectError(<Unicorn unicorn={1} />);
expectError(<Unicorn rainbow='bar' />);
