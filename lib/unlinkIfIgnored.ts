import isFileIgnored from './createIndex/isFileIgnored.js'
import { unlink } from 'fs/promises'

/**
 * Ensure a file is unlinked if it is ignored by git
 */
const unlinkIfIgnored = async (path: string): Promise<void> => {
  if (await isFileIgnored(path)) {
    try {
      await unlink(path)
    } catch (e) {
      if (e.code !== 'ENOENT') throw e
    }
  }
}

export default unlinkIfIgnored
