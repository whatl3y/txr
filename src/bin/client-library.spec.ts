import assert from 'assert'
import fs from 'fs'
import libraryClient from './client-library'
import createServer from '../server'

const port = 8889
const getFile = fs.promises.readFile
const delFile = fs.promises.unlink
const lstat = fs.promises.lstat
createServer(port)

const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

describe('Client interfaces', function () {
  it('should create a listening and sending client, then successfully stream a file from one to the other', async function () {
    this.timeout(5000)

    const [filepathOfNewFileCreated] = await Promise.all([
      libraryClient({
        _: [],
        command: 'listen',
        username: 'listener-testing123',
        host: `http://localhost:${port}`,
      }),
      (async function () {
        await sleep(1000)
        await libraryClient({
          _: [],
          command: 'send',
          username: 'listener-testing123',
          file: './README.md',
          host: `http://localhost:${port}`,
        })
      })(),
    ])

    if (typeof filepathOfNewFileCreated !== 'string')
      throw new Error('not file path')

    const fileStats = await lstat(filepathOfNewFileCreated)
    const fileContents = await getFile(filepathOfNewFileCreated, 'utf8')
    await delFile(filepathOfNewFileCreated)

    assert.equal('string', typeof filepathOfNewFileCreated)
    assert.equal('string', typeof fileContents)
    assert.equal(true, fileContents.length > 100)
    assert.equal(true, fileStats.isFile())
  })

  it(`should throw an error that the user you are trying to send files to isn't listening for files`, async function () {
    try {
      await libraryClient({
        _: [],
        command: 'send',
        username: 'user-that-does-not-exist',
        file: './README.md',
        host: `http://localhost:${port}`,
      })
    } catch (err) {
      assert.equal(true, err instanceof Error || typeof err === 'string')
      assert.equal(true, err.toString().length > 0)
    }
  })
})
