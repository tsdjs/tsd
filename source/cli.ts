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

		const extendedDiagnostics = await tsd(options);

		if (extendedDiagnostics.diagnostics.length > 0) {
			throw new Error(formatter(extendedDiagnostics));
		}
	} catch (error: unknown) {
		if (error && typeof (error as Error).message === 'string') {
			console.error((error as Error).message);
		}

		process.exit(1);
	}
})();
