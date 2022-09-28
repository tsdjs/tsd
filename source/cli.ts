#!/usr/bin/env node
import meow from 'meow';
import formatter from './lib/formatter';
import tsd from './lib';

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

(async () => {
	try {
		const cwd = cli.input.length > 0 ? cli.input[0] : process.cwd();
		const typingsFile = cli.flags.typings;
		const testFiles = cli.flags.files;
		const {showDiff} = cli.flags;

		const options = {cwd, typingsFile, testFiles};

		const diagnostics = await tsd(options);

		if (diagnostics.length > 0) {
			throw new Error(formatter(diagnostics, showDiff));
		}
	} catch (error: unknown) {
		if (error && typeof (error as Error).message === 'string') {
			console.error((error as Error).message);
		}

		process.exit(1);
	}
})();
