interface Options {
  /**
   * Glob patterns of dirs
   */
  dirs: string[]
  watch: boolean
  /**
   * Glob patterns of files
   */
  files: string[]
  force: boolean
  indexFileExtension: string
  importExtension?: string
  rootDir: string
}

export default Options
