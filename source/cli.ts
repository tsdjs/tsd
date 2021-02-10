#!/usr/bin/env node
import * as meow from 'meow';
import * as updateNotifier from 'update-notifier';
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

(async () => {	// tslint:disable-line:no-floating-promises
	updateNotifier({pkg: cli.pkg as updateNotifier.Package}).notify();

	try {
		const options = {
			cwd: cli.input.length > 0 ? cli.input[0] : process.cwd(),
			...cli.flags
		};

		const diagnostics = await tsd(options);

		if (diagnostics.length > 0) {
			throw new Error(formatter(diagnostics));
		}
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
})();
