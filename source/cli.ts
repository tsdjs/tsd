#!/usr/bin/env node
import meow from 'meow';
import formatter from './lib/formatter';
import tsd from './lib';

const cli = meow(`
	Usage
	  $ tsd [path]

	Info
	  --help,    -h  Display help text
	  --version, -v  Display version info

	Options
	  --typings, -t  Type definition file to test  [Default: "types" property in package.json]
	  --files,   -f  Glob of files to test         [Default: /**/*.test-d.ts(x)]

	Examples
	  $ tsd /path/to/project/with/typings/file

	  $ tsd --files /test/some/folder/*.ts --files /test/other/folder/*.ts

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
			isMultiple: true,
			type: 'string',
			alias: 'f',
		},
	},
});

(async () => {
	if (cli.flags.h) {
		cli.showHelp(0);
	}

	if (cli.flags.v) {
		cli.showVersion();
	}

	try {
		const cwd = cli.input.at(0) ?? process.cwd();
		const typingsFile = cli.flags.typings;
		const testFiles = cli.flags.files;

		const options = {cwd, typingsFile, testFiles};

		const diagnostics = await tsd(options);

		if (diagnostics.length > 0) {
			throw new Error(formatter(diagnostics));
		}
	} catch (error: unknown) {
		if (error && typeof (error as Error).message === 'string') {
			console.error((error as Error).message);
		}

		process.exit(1);
	}
})();
