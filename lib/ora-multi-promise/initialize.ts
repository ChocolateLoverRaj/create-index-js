import ora from 'ora'
import OraMultiPromiseData from './OraMultiPromiseData.js'
import { QueryablePromiseState } from 'promise-with-state'
import InitializeOptions from './InitializeOptions.js'

const initialize = (options: InitializeOptions): OraMultiPromiseData => {
  const data: OraMultiPromiseData = {
    taskName: options.taskName,
    spinner: options.spinner ?? ora(),
    promises: options.promises ?? new Set(),
    disposed: false,
    update: () => {
      if (data.disposed) return
      const promisesArr = [...data.promises]
      const states: Record<QueryablePromiseState, number> = Object.fromEntries(
        Object.entries(QueryablePromiseState).map(([key, value]) => [
          key,
          promisesArr.reduce((count: number, promise) => count + Number(promise.state === value), 0)
        ]))
      data.spinner.text =
        `${data.taskName}: ` +
        [
          `${states[QueryablePromiseState.FULFILLED]} Successful`,
          `${states[QueryablePromiseState.REJECTED]} Failed`,
          `${states[QueryablePromiseState.PENDING]} In progress`
        ].join(', ')
      if (states[QueryablePromiseState.PENDING] > 0) {
        data.spinner.start()
      } else if (states[QueryablePromiseState.REJECTED] > 0) {
        data.spinner.fail()
      } else {
        data.spinner.succeed()
      }
    }
  }
  options.promises?.forEach(promise => promise.finally(data.update))
  data.update()
  return data
}

export default initialize
