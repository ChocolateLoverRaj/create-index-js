import { watch } from 'chokidar'
import Options from './Options.js'
import { relative, basename } from 'path'
import Dir from './Dir.js'
import RunWithWatchReturn from './RunWithWatchReturn.js'
import createIndex from '../createIndex/createIndex.js'
import { emit, toPromise } from 'emitter2'
import getFilesToImportFromFiles from './getFilesToImportFromFiles.js'
import splitFileFromExtension from '../splitFileFromExtension.js'
import getParentDir from './getParentDir.js'
import never from 'never'

const runWithWatch = ({
  dir,
  recursive,
  force,
  indexFileExtension,
  importExtension,
  extensions
}: Options): RunWithWatchReturn => {
  let ready = false
  const handleDirChanges = (path: string, dir: Dir): void => {
    const handleChanges = (subDirsWithIndexFiles: Set<string>): void => {
      const createIndexForDir = (): void => {
        emit(dir.onProcess, createIndex({
          dir: path,
          files: getFilesToImportFromFiles(extensions, dir.files),
          force,
          indexFileExtension,
          subDirsToInclude: subDirsWithIndexFiles,
          importExtension
        }))
      }
      createIndexForDir()
      const reProcessOnSubDirChange = (name: string): void => {
        const subDir = dir.files.get(name) ?? never()
        subDir.onProcess.add(createPromise => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          createPromise.then(createdIndex => {
            if (returnObj.disposed) return
            if (createdIndex) {
              subDirsWithIndexFiles.add(name)
              createIndexForDir()
            } else {
              subDirsWithIndexFiles.delete(name)
              createIndexForDir()
            }
          })
        })
      }
      dir.onAdd.add(fileName => {
        const file = dir.files.get(fileName)
        if (file !== undefined) {
          reProcessOnSubDirChange(fileName)
        } else {
          createIndexForDir()
        }
      })
      dir.onUnlink.add((fileName, isDir) => {
        if (isDir) {
          if (subDirsWithIndexFiles.has(fileName)) {
            subDirsWithIndexFiles.delete(fileName)
            createIndexForDir()
          }
        } else {
          createIndexForDir()
        }
      })
    }
    if (ready) handleChanges(new Set())
    else {
      fsWatcher.once('ready', () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
        Promise.all([...dir.files]
          .filter((keyValue): keyValue is [string, Dir] => keyValue[1] !== undefined)
          .map(async ([name, dir]) => {
            const [processPromise] = await toPromise(dir.onProcess)
            return [name, await processPromise] as const
          }))
          .then(processedDirs => {
            const subDirsWithIndexFiles = new Set<string>(processedDirs
              .filter(([, createdIndexFile]) => createdIndexFile)
              .map(([name]) => name))
            handleChanges(subDirsWithIndexFiles)
          })
      })
    }
  }
  const topDir: Dir = {
    files: new Map(),
    onProcess: new Set(),
    onAdd: new Set(),
    onUnlink: new Set()
  }

  const handleUnlink = (path: string, isDir: boolean): void => {
    const relativePath = relative(dir, path)
    const parentDir = getParentDir(topDir, relativePath)
    if (parentDir === undefined) {
      // This is possible
      // Let's say there is a file subDir/muffin.js
      // If we do rm -r subDir, this function will be called with 'subDir' and 'subDir/muffin.js'
      // So 'subDir' might already be deleted, and that's okay
      return
    }
    const fileName = basename(relativePath)
    parentDir.files.delete(fileName)
    emit(parentDir.onUnlink, fileName, isDir)
  }
  const fsWatcher = watch(dir, {
    depth: recursive ? undefined : 1,
    ignored: path => {
      const fileName = basename(path)
      if (fileName.includes('.')) {
        const fileAndExtension = splitFileFromExtension(extensions, fileName)
        if (fileAndExtension === undefined) return true
        if (fileAndExtension.nameWithoutExtension === 'index') return true
      }
      return false
    }
  })
    .on('add', path => {
      const relativePath = relative(dir, path)
      const fileName = basename(relativePath)
      const parentDir = getParentDir(topDir, relativePath) ?? never()
      parentDir.files.set(fileName, undefined)
      emit(parentDir.onAdd, fileName)
    })
    .on('unlink', path => {
      handleUnlink(path, false)
    })
    .on('unlinkDir', path => {
      handleUnlink(path, true)
    })
    .on('addDir', path => {
      if (path === dir) return
      const relativePath = relative(dir, path)
      const fileName = basename(relativePath)
      const parentDir = getParentDir(topDir, relativePath) ?? never()
      const newDir: Dir = {
        files: new Map(),
        onProcess: new Set(),
        onAdd: new Set(),
        onUnlink: new Set()
      }
      handleDirChanges(path, newDir)
      parentDir.files.set(fileName, newDir)
      emit(parentDir.onAdd, fileName)
    })
    .once('ready', () => {
      ready = true
    })
  handleDirChanges(dir, topDir)

  const returnObj: RunWithWatchReturn = {
    dir,
    topDir,
    fsWatcher,
    disposed: false
  }
  return returnObj
}

export default runWithWatch
