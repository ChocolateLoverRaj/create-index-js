import OraMultiPromiseData from './OraMultiPromiseData.js'

const dispose = (data: OraMultiPromiseData): void => {
  data.disposed = true
}

export default dispose
