import OraMultiPromiseData from './OraMultiPromiseData.js'
import { QueryablePromise } from 'promise-with-state'

const add = (data: OraMultiPromiseData, promise: QueryablePromise): void => {
  data.promises.add(promise)
  promise.finally(data.update)
}

export default add
