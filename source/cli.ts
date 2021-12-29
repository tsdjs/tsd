#!/usr/bin/env node
import meow from 'meow';
import formatter from './lib/formatter';
import tsd from './lib';

const cli = meow(`
	Usage
	  $ tsd [path]

	Options
	  --typings-file, -t 	What typings file to test

	Examples
	  $ tsd /path/to/project

	  $ tsd

	    index.test-d.ts
	    ✖  10:20  Argument of type string is not assignable to parameter of type number.
`, {
	flags: {
		typingsFile: {
			alias: 't',
			isRequired: false,
			type: 'string'
		}
	}
});

(async () => {
	try {
		const options = {
			cwd: cli.input.length > 0 ? cli.input[0] : process.cwd(),
			...cli.flags
		};

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
