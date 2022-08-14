#!/usr/bin/env node
import meow from 'meow';
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

(async () => {
	try {
		const options = cli.input.length > 0 ? {cwd: cli.input[0]} : undefined;

		const diagnostics = await tsd(options);

		if (diagnostics.length > 0) {
			throw new Error(formatter(diagnostics));
		}
	} catch (error: unknown) {
		const potentialError = error as Error | undefined | null;
		const errorMessage =
			typeof potentialError?.stack === 'string' ?
				potentialError.stack :
				typeof potentialError?.message === 'string' ?
					potentialError?.message :
					undefined;
		if (errorMessage) {
			console.error(`Error running tsd: ${errorMessage}`);
		}

		process.exit(1);
	}
})();
