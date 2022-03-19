import Dir from './Dir.js'
import { sep } from 'path'

/**
 * Finds the dir by going down the tree based on the path.
 * @param rootDir The known root dir
 * @param path The path relative to the root dir
 * @returns The dir. The dirs path is the `dirname(path)`.
 * Returns `undefined` if one ancestor dir doesn't exist
 */
const getParentDir = (rootDir: Dir, path: string): Dir | undefined => {
  const pathParts = path.split(sep)
  let currentDir = rootDir
  const dirParts = pathParts.slice(0, -1)
  for (const part of dirParts) {
    const subDir = currentDir.files.get(part)
    if (subDir === undefined) return
    currentDir = subDir
  }
  return currentDir
}

export default getParentDir
