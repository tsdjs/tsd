import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('assertions should be identified if imported as an aliased module', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'aliased/aliased-module')});

	verify(diagnostics, []);
});
test.concurrent('assertions should be identified if imported as an alias', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'aliased/aliased-assertion')});

	verify(diagnostics, []);
});
test.concurrent('assertions should be identified if aliased', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'aliased/aliased-const')});

	verify(diagnostics, []);
});
