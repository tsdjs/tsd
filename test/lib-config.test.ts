import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify, verifyWithFileName} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('fail if types are used from a lib that was not explicitly specified', async () => {
	const cwd = path.join(FIXTURES_PATH, 'lib-config/failure-missing-lib');
	const diagnostics = await tsd({cwd});

	verifyWithFileName(cwd, diagnostics, [
		[1, 22, 'error', 'Cannot find name \'Window\'.', 'index.d.ts'],
		[4, 11, 'error', 'Cannot find name \'Window\'.', 'index.test-d.ts'],
	]);
});

test.concurrent('allow specifying a lib as a triple-slash-reference', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'lib-config/lib-as-triple-slash-reference')});

	verify(diagnostics, []);
});

test.concurrent('allow specifying a lib in package.json\'s `tsd` field', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'lib-config/lib-from-package-json')});

	verify(diagnostics, []);
});

test.concurrent('allow specifying a lib in tsconfig.json', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'lib-config/lib-from-tsconfig-json')});

	verify(diagnostics, []);
});

test.concurrent('a lib option in package.json overrdides a lib option in tsconfig.json', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'lib-config/lib-from-package-json-overrides-tsconfig-json')});

	verify(diagnostics, []);
});
