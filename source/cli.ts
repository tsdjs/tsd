#!/usr/bin/env node
import process from 'node:process';
import meow from 'meow';
import prettyFormatter from './lib/formatter.js';
import tsd from './lib/index.js';

const cli = meow(`
	Usage
	  $ tsd [path]

	  The given directory must contain a package.json and a typings file.

	Info
	  --help           Display help text
	  --version        Display version info

	Options
	  --typings    -t  Type definition file to test  [Default: "types" property in package.json]
	  --files      -f  Glob of files to test         [Default: '/path/test-d/**/*.test-d.ts' or '.tsx']
	  --show-diff      Show type error diffs         [Default: don't show]

	Examples
	  $ tsd /path/to/project

	  $ tsd --files /test/some/folder/*.ts --files /test/other/folder/*.tsx

	  $ tsd

	    index.test-d.ts
	    ✖  10:20  Argument of type string is not assignable to parameter of type number.
`, {
	importMeta: import.meta,
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
	},
});

try {
	const cwd = cli.input.at(0) ?? process.cwd();
	const {typings: typingsFile, files: testFiles, showDiff} = cli.flags;

	const options = {cwd, typingsFile, testFiles};

	const diagnostics = await tsd(options);

	if (diagnostics.length > 0) {
		throw new Error(prettyFormatter(diagnostics, showDiff));
	}
} catch (error: unknown) {
	const potentialError = error as Error | undefined;
	const errorMessage = potentialError?.stack ?? potentialError?.message;

	if (errorMessage) {
		console.error(`Error running tsd: ${errorMessage}`);
	}

	process.exit(1);
}
