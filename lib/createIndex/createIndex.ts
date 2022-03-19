import { open, FileHandle, writeFile, unlink } from 'fs/promises'
import Options from './Options.js'
import { join } from 'path'
import isFileIgnored from './isFileIgnored.js'

const createIndex = async ({
  dir,
  files,
  force,
  subDirsToInclude,
  indexFileExtension,
  tsNodeNext
}: Options): Promise<boolean> => {
  const indexFileName = `index${indexFileExtension}`
  const path = join(dir, indexFileName)
  if (files.length + subDirsToInclude.size === 0) {
    if (await isFileIgnored(path)) {
      try {
        await unlink(path)
      } catch (e) {
        if (e.code !== 'ENOENT') throw e
      }
    }
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
    ...files.map(({ nameWithoutExtension, extension }) => {
      const fileName = `${nameWithoutExtension}${tsNodeNext ? '.js' : extension}`
      return `export { default as ${nameWithoutExtension} } from './${fileName}'`
    }),
    ...[...subDirsToInclude].map(subDir =>
      `export * as ${subDir} from './${subDir}/${indexFileName}'`)
  ]
    .map(str => `${str}\n`)
    .join('')
  await writeFile(fileHandle, fileStr)
  await fileHandle.close()
  return true
}

export default createIndex
