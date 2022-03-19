import RunWithWatchReturn from './RunWithWatchReturn.js'

const dispose = (returnObj: RunWithWatchReturn): void => {
  returnObj.fsWatcher.unwatch(returnObj.dir)
  returnObj.disposed = true
}

export default dispose
