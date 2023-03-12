import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('tsx component', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'tsx/component')});

	verify(diagnostics, []);
});

test.concurrent('tsx component type', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'tsx/component-type')});

	verify(diagnostics, []);
});
