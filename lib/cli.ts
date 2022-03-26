#!/usr/bin/env node
import { Command } from 'commander'
import cliRun from './cliRun.js'
import cliRunWithWatch from './cliRunWithWatch.js'
import initialize from './oraMultiPromise/initialize.js'
import { readFile } from 'fs/promises'
import splitLines from 'split-lines'

new Command()
  .argument(
    '[dirs...]',
    'Glob pattern matching dirs to include or exclude. index.js will be created in these dirs')
  .option('-w, --watch', undefined, false)
  .option('-f, --force', "Overwrite / delete index.js files that aren't ignored by git", false)
  .option('-o, --indexFileExtension <>', 'Extension of file to create', '.js')
  .option('-i, --importExtension <>', 'Customize the extension for imported files')
  .option(
    '-c, --dirsConfig <>',
    'File to globs of dirs to include / exclude. Cannot be combined with [dirs...]')
  .option('--files [...files]', 'Which files to import.', ['**/*.+(js|jsx|ts|tsx)'])
  .option(
    '--filesConfig <>',
    'File to globs of files to include / exclude. Cannot be combined with --files')
  .action((dirs, options) => {
    const promises = [
      (async () => {
        if (dirs.length > 0) {
          if (options.dirsConfig !== undefined) {
            throw new Error('--dirsConfig cannot be combined with [dirs...]')
          }
          options.dirs = dirs
        } else if (options.dirsConfig !== undefined) {
          options.dirs = splitLines(await readFile(options.dirsConfig, 'utf8'))
        } else {
          options.dirs = ['**']
        }
      })(),
      (async () => {
        if (options.filesConfig !== undefined) {
          options.files = splitLines(await readFile(options.filesConfig, 'utf8'))
        }
      })()
    ]
    initialize({
      taskName: 'Load config',
      promises: new Set(promises)
    })
    void Promise.all(promises).then(() => {
      if (options.watch as boolean) {
        cliRunWithWatch(options)
      } else {
        cliRun(options)
      }
    })
  })
  .parse()

// FIXME: Don't do this
export default undefined
