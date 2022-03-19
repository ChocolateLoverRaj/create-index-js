import FileAndExtension from './FileAndExtension.js'
import splitFileFromExtension from './splitFileFromExtension.js'

const getFilesToImport = (extensions: string[], files: string[]): FileAndExtension[] => files
  .map(file => splitFileFromExtension(extensions, file))
  .filter((file): file is FileAndExtension => file !== undefined)
  .filter(({ nameWithoutExtension }) => nameWithoutExtension !== 'index')

export default getFilesToImport
