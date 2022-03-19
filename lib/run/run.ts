import createIndex from '../createIndex/createIndex.js'
import { join, basename } from 'path'
import ProcessDirResult from './ProcessDirResult.js'
import Options from '../Options.js'
import { readdir } from 'fs/promises'
import resolveValue from 'resolve-value'
import getFilesToImport from '../getFilesToImport.js'

/**
 * This function is useful for using programmatically
 */
const run = (options: Options): ProcessDirResult => {
  const processDir = (dir: string): ProcessDirResult => {
    const filesPromise = readdir(dir, { withFileTypes: true })
    const subDirsPromise = (async (): Promise<ProcessDirResult[]> => {
      if (options.recursive) {
        return (await filesPromise)
          .filter(file => file.isDirectory())
          .map(({ name }) => name)
          .map(subDir => processDir(join(dir, subDir)))
      }
      return []
    })()
    const createdIndexFilePromise = (async (): Promise<boolean> => {
      const subDirs = await resolveValue(subDirsPromise)
      return await createIndex({
        dir,
        files: getFilesToImport(options.extensions, (await filesPromise)
          .filter(file => file.isFile())
          .map(file => file.name)),
        subDirsToInclude: new Set(subDirs
          .filter(({ createdIndexFile }) => createdIndexFile)
          .map(({ dir }) => basename(dir))),
        force: options.force,
        indexFileExtension: options.indexFileExtension,
        tsNodeNext: options.tsNodeNext
      })
    })()
    return {
      dir,
      createdIndexFile: createdIndexFilePromise,
      subDirs: subDirsPromise
    }
  }
  return processDir(options.dir)
}

export default run
