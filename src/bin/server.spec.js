import assert from 'assert'
import net from 'net'
import createServer from '../server'

describe('Server', function() {
  const port = 8888
  createServer(port)
  it(`should create a server listening on port: ${port}`, async function() {
    // https://gist.github.com/whatl3y/64a08d117b5856c21599b650c4dd69e6
    const isPortInUse = await new Promise((resolve, reject) => {
      const tester = net.createServer()
      .once('error', err => {
        if (err.code != 'EADDRINUSE')
          return reject(err)
        resolve(true)
      })
      .once('listening', () => tester.once('close', () => resolve(false)).close())
      .listen(port)
    })

    assert.equal(true, isPortInUse)
  })
})
