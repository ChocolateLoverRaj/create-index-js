import { exec } from 'child_process'
import { Readable, PassThrough } from 'stream'
import streamToString from 'stream-to-string'
import { StringDecoder } from 'string_decoder'
import never from 'never'
import last from 'last-element'
import streamWrite from 'stream-write'

/**
 * Runs `git check-ignore` and parses the result
 * @param paths Paths relative to working directory
 * @returns A readable stream in object mode. Each chunk will be a string that is ignored by git.
 */
const gitCheckIgnore = async (paths: Set<string>): Promise<Readable> =>
  await new Promise((resolve, reject) => {
    const pathsArr = [...paths]
    const git = exec(`git check-ignore ${pathsArr.join(' ')}`)

    const gitStdErr = git.stderr ?? never()
    const stdErrStringPromise = streamToString(gitStdErr)
    gitStdErr.once('data', () => {
      stdErrStringPromise
        .then(string => reject(new Error(string)))
        .catch(reject)
    })

    let bufferStr: string | undefined
    let stringDecoder: StringDecoder | undefined
    let ignoredPathsStream: PassThrough | undefined
    const gitStdOut = git.stdout ?? never()
    gitStdOut
      .once('data', () => {
        bufferStr = ''
        stringDecoder = new StringDecoder()
        ignoredPathsStream = new PassThrough({ objectMode: true })
        resolve(ignoredPathsStream)
      })
      .on('data', (data: Buffer) => {
        if (bufferStr === undefined) throw new Error('Buffer string is undefined')
        bufferStr += (stringDecoder ?? never()).write(data)
        const files = (bufferStr ?? never()).split('\n')
        const [...finishedFiles] = files.slice(0, -1)
        const incompleteFile = last(files)
        ;(async () => {
          gitStdErr.pause()
          for (const finishedFile of finishedFiles) {
            await streamWrite(ignoredPathsStream ?? never(), finishedFile)
          }
          gitStdErr.resume()
        })().catch(error => {
          (ignoredPathsStream ?? never()).emit('error', error)
        })
        bufferStr = incompleteFile
      })
      .once('end', () => {
        if (bufferStr === undefined) {
          // This means that no files are ignored
          resolve(new PassThrough({ objectMode: true }).end())
        } else {
          bufferStr += (stringDecoder ?? never()).end()
          ;(ignoredPathsStream ?? never()).end(bufferStr !== '' ? bufferStr : undefined)
        }
      })
  })

export default gitCheckIgnore
