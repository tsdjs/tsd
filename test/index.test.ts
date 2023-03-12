import path from 'path';
import {test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import tsd from '../dist';

test.concurrent('use moduleResolution `nodenext` when module is `nodenext` in tsconfig.json', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'module-resolution/nodenext-from-tsconfig-json')});
	verify(diagnostics, []);
});

test.concurrent('use moduleResolution `nodenext` when module is `nodenext` in package.json', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'module-resolution/nodenext-from-package-json')});
	verify(diagnostics, []);
});

test.concurrent('use moduleResolution `node16` when module is `node16` in tsconfig.json', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'module-resolution/node16-from-tsconfig-json')});
	verify(diagnostics, []);
});

test.concurrent('use moduleResolution `node16` when module is `node16` in package.json', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'module-resolution/node16-from-package-json')});
	verify(diagnostics, []);
});

