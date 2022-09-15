import {expectType} from '../../../..';

const tag = (strings: TemplateStringsArray, ...args: any[]) => {
	let value = strings[0];
	let i = 0;

	while (i < args.length) {
		let s: string;

		if (Array.isArray(args[i])) {
			// PROBLEM: Identifiers `map` and `join` have no Symbols
			// TS should infer `args[i]` as `Array<any>`, but doesn't
			// `checker.getSymbolAtLocation(expression)` is undefined
			s = args[i].map((x: any) => `${x}`).join(' ');
		} else {
			s = `${args[i]} `;
		}

		value += s;
	}

	return value;
};

// fails with `Cannot read properties of undefined (reading 'flags')` in 0.24.0
expectType<string>(tag`foo`);
