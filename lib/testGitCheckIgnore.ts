import never from 'never'
import gitCheckIgnore from './gitCheckIgnore.js'

gitCheckIgnore(new Set(['LICENSE', 'index.js', 'dist', 'dist/index.js']))
  .then(ignoredPathsStream => {
    (ignoredPathsStream ?? never())
      .on('data', data => {
        console.log('This file is ignored:', [data])
      })
      .once('close', () => {
        console.log('Ignored files stream closed')
      })
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
