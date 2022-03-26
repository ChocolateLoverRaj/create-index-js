import { open, FileHandle, writeFile } from 'fs/promises'
import Options from './Options.js'
import { join, extname, relative, sep } from 'path'
import isFileIgnored from './isFileIgnored.js'
import unlinkIfIgnored from '../unlinkIfIgnored.js'
import getIndexFileName from '../getIndexFileName.js'
import minimatchAll from 'minimatch-all'

const createIndex = async ({
  dir,
  dirs,
  files,
  force,
  subDirsToInclude,
  indexFileExtension,
  importExtension,
  rootDir
}: Options): Promise<boolean> => {
  const indexFileName = getIndexFileName(indexFileExtension)
  const path = join(dir, indexFileName)
  if (
    !(minimatchAll(sep + relative(rootDir, dir), dirs) as boolean) ||
    files.length + subDirsToInclude.size === 0
  ) {
    await unlinkIfIgnored(path)
    return false
  }
  let fileHandle: FileHandle
  if (force) {
    fileHandle = await open(path, 'w')
  } else {
    try {
      fileHandle = await open(path, 'wx')
    } catch (e) {
      if (e.code === 'EEXIST') {
        const overWrite = await isFileIgnored(path)
        if (!overWrite) return false
        fileHandle = await open(path, 'w')
      } else throw e
    }
  }
  const fileStr = [
    ...files.map(file => {
      const extension = extname(file)
      const nameWithoutExtension = file.slice(0, -extension.length)
      const fileName = `${nameWithoutExtension}${importExtension ?? extension}`
      return `export { default as ${nameWithoutExtension} } from './${fileName}'`
    }),
    ...[...subDirsToInclude].map(subDir =>
      `export * as ${subDir} from './${subDir}/index${importExtension ?? indexFileExtension}'`)
  ]
    .map(str => `${str}\n`)
    .join('')
  await writeFile(fileHandle, fileStr)
  await fileHandle.close()
  return true
}

export default createIndex
