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
const run = ({
  dirs,
  files,
  force,
  indexFileExtension,
  rootDir,
  importExtension
}: Options): ProcessDirResult => {
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
        dirs,
        files: (await filesPromise)
          .filter(file => file.isFile())
          .map(file => file.name)
          .filter(name => name.slice(0, -extname(name).length) !== 'index')
          .filter(name => {
            const path = sep + relative(rootDir, join(dir, name))
            return minimatchAll(path, files)
          }),
        subDirsToInclude: new Set(subDirs
          .filter(({ createdIndexFile }) => createdIndexFile)
          .map(({ dir }) => basename(dir))),
        force,
        indexFileExtension,
        importExtension,
        rootDir
      })
    })()
    return {
      dir,
      createdIndexFile: createdIndexFilePromise,
      subDirs: subDirsPromise
    }
  }
  return processDir(rootDir)
}

export default run
