import RunWithWatchReturn from './RunWithWatchReturn.js'

const dispose = (returnObj: RunWithWatchReturn): void => {
  returnObj.fsWatcher.unwatch(process.cwd())
  returnObj.disposed = true
}

export default dispose
