import FileAndExtension from './FileAndExtension.js'
import { extname } from 'path'

const splitFileFromExtension = (file: string): FileAndExtension => {
  const extension = extname(file)
  const nameWithoutExtension = file.slice(0, -extension.length)
  return { extension, nameWithoutExtension }
}

export default splitFileFromExtension
