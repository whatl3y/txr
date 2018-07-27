import assert from 'assert'
import fs from 'fs'
import promisify from 'es6-promisify'
import libraryClient from './client-library'
import createServer from '../server'

const getFile = promisify(fs.readFile)
const delFile = promisify(fs.unlink)
const lstat   = promisify(fs.lstat)
createServer(8899)

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

describe('Client interfaces', function() {
  it('should create a listening and sending client, then successfully stream a file from one to the other', async function() {
    this.timeout(5000)

    const [ filepathOfNewFileCreated, senderResult ] = await Promise.all([
      libraryClient({
        command: 'listen',
        username: 'listener-testing123',
        host: 'http://localhost:8899'
      }),
      (async function() {
        await sleep(1000)
        await libraryClient({
          command: 'send',
          username: 'listener-testing123',
          file: './README.md',
          host: 'http://localhost:8899'
        })
      })()
    ])

    const fileStats     = await lstat(filepathOfNewFileCreated)
    const fileContents  = await getFile(filepathOfNewFileCreated, 'utf8')
    await delFile(filepathOfNewFileCreated)

    assert.equal('string', typeof filepathOfNewFileCreated)
    assert.equal('string', typeof fileContents)
    assert.equal(true, fileContents.length > 100)
    assert.equal(true, fileStats.isFile())
  })

  it(`should throw an error that the user you are trying to send files to isn't listening for files`, async function() {
    try {
      await libraryClient({
        command: 'send',
        username: 'user-that-does-not-exist',
        file: './README.md',
        host: 'http://localhost:8899'
      })
    } catch(err) {
      assert.equal(true, err instanceof Error || typeof err === 'string')
      assert.equal(true, err.toString().length > 0)
    }
  })
})
