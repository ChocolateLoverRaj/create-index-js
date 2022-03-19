import OraMultiPromiseData from './OraMultiPromiseData.js'

type InitializeOptions =
  Partial<Pick<OraMultiPromiseData, 'promises' | 'spinner'>> & Pick<OraMultiPromiseData, 'taskName'>

export default InitializeOptions
