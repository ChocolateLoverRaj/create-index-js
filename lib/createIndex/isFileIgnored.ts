
import gitCheckIgnore from '../gitCheckIgnore.js'
import streamToArray from 'stream-to-array'

const isFileIgnored = async (path: string): Promise<boolean> =>
  (await streamToArray(await gitCheckIgnore(new Set([path])))).length > 0

export default isFileIgnored
