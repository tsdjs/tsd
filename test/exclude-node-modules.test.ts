import path from 'path';
import {expect, test} from 'vitest';
import {FIXTURES_PATH} from './fixtures/constants';
import {verify} from './fixtures/utils';
import {Diagnostic} from '../source/lib/interfaces';
import tsd from '../dist';

test.concurrent('errors in libs from node_modules are not reported', async () => {
	const diagnostics = await tsd({cwd: path.join(FIXTURES_PATH, 'exclude-node-modules')});
	const [nodeModuleDiagnostics, testFileDiagnostics, otherDiagnostics] = diagnostics.reduce<Diagnostic[][]>(
		([nodeModuleDiags, testFileDiags, otherDiags], diagnostic) => {
			if (/[/\\]node_modules[/\\]/.test(diagnostic.fileName)) {
				nodeModuleDiags.push(diagnostic);
			} else if (/[/\\]fixtures[/\\]exclude-node-modules[/\\]/.test(diagnostic.fileName)) {
				testFileDiags.push(diagnostic);
			} else {
				otherDiags.push(diagnostic);
			}

			return [nodeModuleDiags, testFileDiags, otherDiags];
		},
		[[], [], []]
	);

	expect(
		nodeModuleDiagnostics.length,
		'There must be no errors from node_modules folders when standard lib is not available (option `"noLib": true`).'
	).toBe(0);

	expect(
		otherDiagnostics.length > 0,
		'There must be errors from tsd lib when standard lib is not available (option `"noLib": true`).'
	).toBe(true);

	const alloweOtherFileFailures = [
		/[/\\]lib[/\\]index.d.ts$/,
		/[/\\]lib[/\\]interfaces.d.ts$/,
	];

	otherDiagnostics.forEach(diagnostic => {
		expect(
			alloweOtherFileFailures.some(allowedFileRe => allowedFileRe.test(diagnostic.fileName)),
			`Found diagnostic from an unexpected file: ${diagnostic.fileName} - ${diagnostic.message}`
		).toBe(true);
	});

	verify(testFileDiagnostics, [
		[3, 18, 'error', 'Cannot find name \'Bar\'.']
	]);
});
