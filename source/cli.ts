#!/usr/bin/env node
import meow from 'meow';
import formatter from './lib/formatter';
import tsd from './lib';

const cli = meow(`
	Usage
	  $ tsd [path]

	Options
	  --help,    -h  Display help text
	  --version, -v  Display version info

	Examples
	  $ tsd /path/to/project

	  $ tsd

	    index.test-d.ts
	    ✖  10:20  Argument of type string is not assignable to parameter of type number.
`);

(async () => {
	if (cli.flags.h) {
		cli.showHelp(0);
	}

	if (cli.flags.v) {
		cli.showVersion();
	}

	try {
		const options = cli.input.length > 0 ? {cwd: cli.input[0]} : undefined;

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
