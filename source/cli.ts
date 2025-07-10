#!/usr/bin/env node
import meow from 'meow';
import {TsdError} from './lib/interfaces';
import formatter from './lib/formatter';
import tsd from './lib';

const cli = meow(`
	Usage
	  $ tsd [path]

	  The given directory must contain a package.json and a typings file.

	Info
	  --help                Display help text
	  --version             Display version info

	Options
	  --typings    -t       Type definition file to test  [Default: "types" property in package.json]
	  --files      -f       Glob of files to test         [Default: '/path/test-d/**/*.test-d.ts' or '.tsx']
	  --show-diff           Show type error diffs         [Default: don't show]
	  --pass-with-no-tests  Pass when no tests are found  [Default: false]

	Examples
	  $ tsd /path/to/project

	  $ tsd --files /test/some/folder/*.ts --files /test/other/folder/*.tsx

	  $ tsd

	    index.test-d.ts
	    ✖  10:20  Argument of type string is not assignable to parameter of type number.
`, {
	flags: {
		typings: {
			type: 'string',
			alias: 't',
		},
		files: {
			type: 'string',
			alias: 'f',
			isMultiple: true,
		},
		showDiff: {
			type: 'boolean',
		},
		passWithNoTests: {
			default: false,
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

(async () => {
	try {
		const cwd = cli.input.length > 0 ? cli.input[0] : process.cwd();
		const {typings: typingsFile, files: testFiles, showDiff, passWithNoTests} = cli.flags;

		const diagnostics = await tsd({cwd, typingsFile, testFiles, passWithNoTests});

		if (diagnostics.length > 0) {
			const hasErrors = diagnostics.some(diagnostic => diagnostic.severity === 'error');
			const formattedDiagnostics = formatter(diagnostics, showDiff);

			exit(formattedDiagnostics, {isError: hasErrors});
		}
	} catch (error: unknown) {
		const potentialError = error as Error | undefined;

		if (potentialError instanceof TsdError) {
			exit(potentialError.message);
		}

		const errorMessage = potentialError?.stack ?? potentialError?.message ?? 'tsd unexpectedly crashed.';

		exit(`Error running tsd:\n${errorMessage}`);
	}
})();
