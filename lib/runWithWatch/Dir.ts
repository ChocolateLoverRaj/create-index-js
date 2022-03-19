import { Data } from 'emitter2'
import Files from './Files.js'
import OnProcess from './OnProcess.js'

interface Dir {
  files: Files
  onProcess: OnProcess
  onAdd: Data<[string]>
  onUnlink: Data<[string, boolean]>
}

export default Dir
