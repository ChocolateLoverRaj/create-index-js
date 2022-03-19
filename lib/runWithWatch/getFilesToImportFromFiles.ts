import FileAndExtension from '../FileAndExtension.js'
import getFilesToImport from '../getFilesToImport.js'
import Files from './Files.js'

const getFilesToImportFromFiles = (extensions: string[], files: Files): FileAndExtension[] =>
  getFilesToImport(extensions, [...files]
    .filter(([, dir]) => dir === undefined)
    .map(([name]) => name))

export default getFilesToImportFromFiles
