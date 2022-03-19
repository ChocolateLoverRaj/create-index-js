import { Ora } from 'ora'
import { QueryablePromise } from 'promise-with-state'

interface OraMultiPromiseData {
  taskName: string
  spinner: Ora
  promises: Set<QueryablePromise>
  disposed: boolean
  update: () => void
}

export default OraMultiPromiseData
