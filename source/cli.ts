#!/usr/bin/env node
import * as meow from 'meow';
import * as updateNotifier from 'update-notifier';
import formatter from './lib/formatter';
import tsd from './lib';

const cli = meow(`
	Usage
	  $ tsd [path]

	Examples
	  $ tsd /path/to/project

	  $ tsd

	    index.test-d.ts
	    ✖  10:20  Argument of type string is not assignable to parameter of type number.
`);

(async () => {	// tslint:disable-line:no-floating-promises
	updateNotifier({pkg: (cli.pkg as updateNotifier.Package)}).notify();

	try {
		const options = cli.input.length > 0 ? {cwd: cli.input[0]} : undefined;

		const diagnostics = await tsd(options);

		if (diagnostics.length > 0) {
			throw new Error(formatter(diagnostics));
		}
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
})();
