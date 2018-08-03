import assert from 'assert'
import net from 'net'
import request from 'request-promise-native'
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

  describe('/clients', function() {
    it(`should return client information back in JSON`, async function() {
      const response = await request.get({ uri: `http://localhost:8888/clients`, json: true })

      console.log("RES", response)

      assert.equal(true, response.data instanceof Array)
      assert.equal(1, [0, 1].includes(response.number_of_pages))
      assert.equal(1, response.current_page)
    })
  })
})
