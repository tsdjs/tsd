import * as React from 'react';
import {expectType, expectError} from '../../..';
import {Unicorn} from '.';

expectType<JSX.Element>(<Unicorn rainbow='🌈' />);

expectError(<Unicorn foo='bar' />);
