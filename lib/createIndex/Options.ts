interface Options {
  dir: string
  dirs: readonly string[]
  files: readonly string[]
  subDirsToInclude: Set<string>
  force: boolean
  indexFileExtension: string
  importExtension?: string
  rootDir: string
}

export default Options
