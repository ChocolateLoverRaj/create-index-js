import { FSWatcher } from 'chokidar'
import Dir from './Dir.js'

interface RunWithWatchReturn {
  topDir: Dir
  fsWatcher: FSWatcher
  disposed: boolean
}

export default RunWithWatchReturn
