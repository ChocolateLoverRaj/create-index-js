# @programmerraj/create-index-js
Creates an index.js file which exports all the files from a directory.

![Created with ](https://img.shields.io/badge/Created%20with-@programmerraj/create-3cb371?style=flat)
[![TS-Standard - Typescript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard/blue?icon=typescript)](https://github.com/standard/ts-standard)

Isn't this so inconvenient:
```js
import a from './dir/a.js'
import b from './dir/b.js'
```

Instead you can do this:
```js
import { a, b } from './dir/index.js'
```

`./dir/index.js` Will be automatically generated:
```js
export a from './a.js'
export b from './b.js'
```

Sub directories are also exported:
```js
export { default as goodNumber } from './goodNumber.js'
export { default as isOdd } from './isOdd.js'
export * as fruits from './fruits/index.js'
```

## CLI Usage
```bash
create-index-js myDir
```

### Watch Mode
Use `-w` or `--watch` option to re-create file when files get created or deleted. This mode is efficient because it only re-creates the file when it needs to, and doesn't do any extra file system operations.

### Other Options
Do `-h` or `--help` to see all options

## Programmatic Usage
All helper files are exported, but the files that are probably useful are `run/run.js` and `runWithWatch/runWithWatch.js`.

### Run
```js
import { run } from '@programmerraj/create-index-js'

run.run(options)
```

### Run in Watch Mode
```js
import { runWithWatch } from '@programmerraj/create-index-js'

runWithWatch.runWithWatch(options)
```

### Docs
TypeScript types are published. You can see the online TypeDocs at https://chocolateloverraj.github.io/create-index-js.
