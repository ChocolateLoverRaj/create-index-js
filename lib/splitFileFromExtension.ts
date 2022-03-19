import FileAndExtension from './FileAndExtension.js'
import getExtension from './getExtension.js'

const splitFileFromExtension = (
  extensions: string[],
  file: string
): FileAndExtension | undefined => {
  const extension = getExtension(extensions, file)
  if (extension === undefined) return
  const nameWithoutExtension = file.slice(0, -extension.length)
  return { extension, nameWithoutExtension }
}

export default splitFileFromExtension
