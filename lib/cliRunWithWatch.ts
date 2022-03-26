import Options from './Options.js'
import Dir from './runWithWatch/Dir.js'
import runWithWatch from './runWithWatch/runWithWatch.js'
import { join, sep } from 'path'

const cliRunWithWatch = ({
  dirs,
  files,
  force,
  indexFileExtension,
  importExtension,
  rootDir
}: Options): void => {
  const { topDir } = runWithWatch({
    dirs,
    files,
    force,
    indexFileExtension,
    importExtension,
    rootDir
  })

  // TODO: Nicer looking logging
  const logDir = (path: string, dir: Dir): void => {
    dir.onProcess.add(promise => {
      console.log(`${path} - Processing`)
      promise
        .then(didCreate => {
          if (didCreate) {
            console.log(`${path} - Created index file`)
          } else {
            console.log(`${path} - Didn't create index file`)
          }
        })
        .catch(() => {
          console.log(`${path} - Error processing`)
        })
    })
    dir.onAdd.add(fileName => {
      const subDir = dir.files.get(fileName)
      if (subDir !== undefined) {
        logDir(join(path, fileName), subDir)
      }
    })
  }
  logDir(sep, topDir)
}

export default cliRunWithWatch
