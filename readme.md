# tsd [![Build Status](https://travis-ci.org/SamVerschueren/tsd.svg?branch=master)](https://travis-ci.org/SamVerschueren/tsd)

> Check TypeScript type definitions


## Install

```
$ npm install tsd
```


## Usage

Let's assume we wrote a `index.d.ts` type definition for our concat module.

```ts
declare const concat: {
	(value1: string, value2: string): string;
	(value1: number, value2: number): string;
};

export default concat;
```

In order to test this definition, add a `index.test-d.ts` file.

```ts
import concat from '.';

concat('foo', 'bar');
concat(1, 2);
```

Running `npx tsd` as a command will verify that the type definition works correctly.

Let's add some extra [assertions](#assertions). We can assert the return type of our function call to match a certain type.

```ts
import {expectType} from 'tsd';
import concat from '.';

expectType<string>(concat('foo', 'bar'));
expectType<string>(concat(1, 2));
```

The `tsd` command will succeed again.

We change our implementation and type definition to return a `number` when both inputs are of type `number`.

```ts
declare const concat: {
	(value1: string, value2: string): string;
	(value1: number, value2: number): number;
};

export default concat;
```

If we don't change the test file and we run the `tsd` command again, the test will fail.

<img src="screenshot.png" width="1330">

### Top-level `await`

If your method returns a `Promise`, you can use top-level `await` to resolve the value instead of wrapping it in an `async` [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE).

```ts
import {expectType, expectError} from 'tsd';
import concat from '.';

expectType<Promise<string>>(concat('foo', 'bar'));

expectType<string>(await concat('foo', 'bar'));

expectError(await concat(true, false));
```

### Test directory

When you have spread your tests over multiple files, you can store all those files in a test directory called `test-d`. If you want to use another directory name, you can change it in `package.json`.

```json
{
	"name": "my-module",
	"tsd": {
		"directory": "my-test-dir"
	}
}
```

Now you can put all your test files in the `my-test-dir` directory.

### Custom TypeScript config

By default, `tsd` applies the following configuration:

```json5
{
	"strict": true,
	"jsx": "react",
	"target": "es2017",
	"lib": ["es2017"],
	"module": "commonjs",
	// The following option is set and is not overridable:
	"moduleResolution": "node"
}
```

These options will be overridden if a `tsconfig.json` file is found in your project. You also have the possibility to provide a custom config by specifying it in `package.json`:

```json
{
	"name": "my-module",
	"tsd": {
		"compilerOptions": {
			"strict": false
		}
	}
}
```

*Default options will apply if you don't override them explicitly.* You can't override the `moduleResolution` option.

## Assertions

### expectType&lt;T&gt;(value)

Check if a value is of a specific type.

### expectError(function)

Check if the function call has argument type errors.

### expectError&lt;T&gt;(value)

Check if a value is of the provided type `T`.


## License

MIT © [Sam Verschueren](https://github.com/SamVerschueren)
