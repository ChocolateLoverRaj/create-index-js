import createIndex from '../createIndex/createIndex.js'
import { join, basename, relative, sep, extname } from 'path'
import ProcessDirResult from './ProcessDirResult.js'
import Options from '../Options.js'
import { readdir } from 'fs/promises'
import resolveValue from 'resolve-value'
import minimatchAll from 'minimatch-all'

/**
 * This function is useful for using programmatically
 */
const run = (options: Options): ProcessDirResult => {
  const processDir = (dir: string): ProcessDirResult => {
    const filesPromise = readdir(dir, { withFileTypes: true })
    const subDirsPromise = (async (): Promise<ProcessDirResult[]> => {
      return (await filesPromise)
        .filter(file => file.isDirectory())
        .map(({ name }) => name)
        .map(subDir => processDir(join(dir, subDir)))
    })()
    const createdIndexFilePromise = (async (): Promise<boolean> => {
      const subDirs = await resolveValue(subDirsPromise)
      return await createIndex({
        dir,
        dirs: options.dirs,
        files: (await filesPromise)
          .filter(file => file.isFile())
          .map(file => file.name)
          .filter(name => name.slice(0, -extname(name).length) !== 'index')
          .filter(name => {
            const path = sep + relative(process.cwd(), join(dir, name))
            return minimatchAll(path, options.files)
          }),
        subDirsToInclude: new Set(subDirs
          .filter(({ createdIndexFile }) => createdIndexFile)
          .map(({ dir }) => basename(dir))),
        force: options.force,
        indexFileExtension: options.indexFileExtension,
        importExtension: options.importExtension
      })
    })()
    return {
      dir,
      createdIndexFile: createdIndexFilePromise,
      subDirs: subDirsPromise
    }
  }
  return processDir(process.cwd())
}

export default run
