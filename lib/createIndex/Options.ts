import FileAndExtension from '../FileAndExtension.js'

interface Options {
  dir: string
  files: FileAndExtension[]
  subDirsToInclude: Set<string>
  force: boolean
  indexFileExtension: string
  importExtension?: string
}

export default Options
