interface ProcessDirResult {
  dir: string
  createdIndexFile: Promise<boolean>
  subDirs: Promise<ProcessDirResult[]>
}

export default ProcessDirResult
