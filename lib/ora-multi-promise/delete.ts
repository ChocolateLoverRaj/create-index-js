import OraMultiPromiseData from './OraMultiPromiseData.js'
import { QueryablePromise } from 'promise-with-state'

const _delete = (data: OraMultiPromiseData, promise: QueryablePromise): void => {
  data.promises.delete(promise)
}

export default _delete
