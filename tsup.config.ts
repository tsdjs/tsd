import type {Options} from 'tsup';

export default {
	tsconfig: 'tsconfig.tsd.json',
	entry: ['source/index.ts'],
	dts: {
		entry: 'source/index.ts',
		resolve: true,
		only: true,
	},
	format: 'esm',
	clean: true,
} satisfies Options;
