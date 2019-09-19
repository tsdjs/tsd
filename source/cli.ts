#!/usr/bin/env node
import * as meow from 'meow';
import * as updateNotifier from 'update-notifier';
import formatter from './lib/formatter';
import tsd from './lib';

const cli = meow(`
	Usage
		$ tsd [path]

	Options
		--verify-size, -s  Keep on top of the memory usage with a data snapshot
		--write, -w        Overwrite existing memory usage JSON fixture
		--size-delta, -d   What percent of change is allow in memory usage, default is 10

	Examples
	  $ tsd /path/to/project

	  $ tsd

	    index.test-d.ts
	    ✖  10:20  Argument of type string is not assignable to parameter of type number.
`,
	{
		flags: {
			verifySize: {
				type: 'boolean',
				alias: 'u'
			},
			write: {
				type: 'boolean',
				alias: 'w'
			},
			sizeDelta: {
				type: 'string',
				alias: 'd',
				default: '10'
			}
		}
	}
);

(async () => {	// tslint:disable-line:no-floating-promises
	updateNotifier({pkg: cli.pkg}).notify();

	try {
		const cwd = cli.input.length > 0 ? cli.input[0] : process.cwd();
		const options = {
			cwd,
			verify: cli.flags.verifySize,
			writeSnapshot: cli.flags.write,
			sizeDelta: parseInt(cli.flags.sizeDelta, 10)
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
