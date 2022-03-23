#!/usr/bin/env node
import { Command } from 'commander'
import { normalize } from 'path'
import cliRun from './cliRun.js'
import cliRunWithWatch from './cliRunWithWatch.js'

new Command()
  .argument(
    '[dir]',
    'The directory to create index.js file for. Uses current directory by default.')
  .option('-r, --recursive', undefined, true)
  .option('-w, --watch', undefined, false)
  .option('-e, --extensions <>', 'Files with which extensions to export', '.js, .jsx, .ts, .tsx')
  .option('-f, --force', "Overwrite / delete index.js files that aren't ignored by git", false)
  .option('-o, --indexFileExtension <>', 'Extension of file to create', '.js')
  .option('-i, --importExtension <>', 'Customize the extension for imported files')
  .action((dir, options) => {
    options.extensions = options.extensions.split(',').map(s => s.trim())
    options.dir = dir !== undefined ? normalize(dir) : process.cwd()
    if (options.watch as boolean) {
      cliRunWithWatch(options)
    } else {
      console.log(options)
      cliRun(options)
    }
  })
  .parse()

// FIXME: Don't do this
export default undefined
