import * as React from 'react';
import {expectType, expectError} from '../../../..';
import {Unicorn} from '.';

expectType<JSX.Element>(<Unicorn unicorn={1} rainbow='🌈' />);

expectError(<Unicorn foo='bar' />);
expectError(<Unicorn unicorn={1} />);
expectError(<Unicorn rainbow='bar' />);
