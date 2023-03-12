import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verifyWithFileName} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('fail if `typings` property is used instead of `types`', async () => {
	const cwd = path.join(FIXTURES_PATH, 'types-property/typings');
	const diagnostics = await tsd({cwd});

	verifyWithFileName(cwd, diagnostics, [
		[3, 1, 'error', 'Use property `types` instead of `typings`.', 'package.json'],
	]);
});

