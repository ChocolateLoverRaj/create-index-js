import Options from './Options.js'
import * as OraMultiPromise from './oraMultiPromise/index.js'
import run from './run/run.js'
import { makeQueryablePromise } from 'promise-with-state'
import { ProcessDirResult } from './run/index.js'
import resolveValue from 'resolve-value'
import logTree from 'console-log-tree'
import { basename } from 'path'

/**
 * Like `run`, but used in the cli, and outputs to console.
 */
const cliRun = (options: Options): void => {
  const oraMultiPromise = OraMultiPromise.initialize({
    taskName: `Create index${options.indexFileExtension}`
  })
  const result = run(options)
  const showResult = (result: ProcessDirResult): void => {
    OraMultiPromise.add(oraMultiPromise, makeQueryablePromise((async () => {
      const subDirs = await result.subDirs
      subDirs.forEach(result => showResult(result))
    })()))
  }
  showResult(result)
  resolveValue(result).then(result => {
    console.log(`Created index${options.indexFileExtension} files for the following dirs`)
    const getTree = ({ dir, subDirs, createdIndexFile }: any): any => ({
      name: `${basename(dir)} ${(createdIndexFile as boolean) ? '\u{2714}' : '\u{274C}'}`,
      children: subDirs.map(dirs => getTree(dirs))
    })
    // const mappedDirs = recursiveMap<string>(dirs, dir => basename(dir)) as Dirs
    const tree = getTree(result)
    logTree.log(tree)
  })
}

export default cliRun
