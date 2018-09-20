#!/usr/bin/env node
import * as meow from 'meow';
import * as updateNotifier from 'update-notifier';
import formatter from './lib/formatter';
import tsdCheck from './lib';

const cli = meow(`
	Usage
		$ tsd-check [path]

	Examples
	  $ tsd-check /path/to/project

	  $ tsd-check

	    index.test-d.ts
	    ✖  10:20  Argument of type string is not assignable to parameter of type number.
`);

(async () => {	// tslint:disable-line:no-floating-promises
	updateNotifier({pkg: cli.pkg}).notify();

	try {
		const options = cli.input.length > 0 ? {cwd: cli.input[0]} : undefined;

		const diagnostics = await tsdCheck(options);

		if (diagnostics.length > 0) {
			console.log(formatter(diagnostics));

			throw new Error(`Found ${diagnostics.length} issues.`);
		}
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
