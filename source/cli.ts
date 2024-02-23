#!/usr/bin/env tsimp
import process from 'node:process';
import meow from 'meow';
import {TsdError} from './lib/interfaces.js';
import formatter from './lib/formatter.js';
import tsd from './lib/index.js';

const cli = meow(`
	Usage
	  $ tsd [path]

	  The given directory must contain a package.json.

	Info
	  --help           Display help text
	  --version        Display version info

	Options
	  --files      -f  Glob of files to test  [Default: 'path/test-d/**/*.test-d.ts']
	  --show-diff      Show type error diffs  [Default: don't show]

	Examples
	  $ tsd path/to/project

	  $ tsd --files test/some/folder/*.ts --files test/other/folder/*.tsx

	  $ tsd

	    index.test-d.ts
	    ✖  10:20  Argument of type string is not assignable to parameter of type number.
`, {
	importMeta: import.meta,
	flags: {
		files: {
			type: 'string',
			shortFlag: 'f',
			isMultiple: true,
		},
		showDiff: {
			type: 'boolean',
		},
	},
});

/**
 * Displays a message and exits, conditionally erroring.
 *
 * @param message The message to display.
 * @param isError Whether or not to fail on exit.
 */
const exit = (message: string, {isError = true}: {isError?: boolean} = {}) => {
	if (isError) {
		console.error(message);
		process.exit(1);
	} else {
		console.log(message);
		process.exit(0);
	}
};

try {
	const cwd = cli.input.at(0) ?? process.cwd();
	const {files: testFiles, showDiff} = cli.flags;

	const diagnostics = await tsd({cwd, testFiles});

	if (diagnostics.length > 0) {
		const hasErrors = diagnostics.some(diagnostic => diagnostic.severity === 'error');
		const formattedDiagnostics = formatter(diagnostics, showDiff);

		exit(formattedDiagnostics, {isError: hasErrors});
	}
} catch (error) {
	const potentialError = error as Error | undefined;

	if (potentialError instanceof TsdError) {
		exit(potentialError.message);
	}

	const errorMessage = potentialError?.stack ?? potentialError?.message ?? 'tsd unexpectedly crashed.';

	exit(`Error running tsd:\n${errorMessage}`);
}
