interface AddedFile {
  name: string
  /**
   * `undefined` if file. `boolean` if dir
   */
  hasIndexFile?: boolean
}

export default AddedFile
