import assert from 'assert'
import child_process from 'child_process'
import net from 'net'
import request from 'request-promise-native'
import Redis from 'ioredis'
import libraryClient from './client-library'
import createServer from '../server'
import createServerProcess from './server'
import appTypes from '../server/app-types'

const fork = child_process.fork

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
      assert.equal(true, response.data instanceof Array)
      assert.equal(1, [0, 1].includes(response.number_of_pages))
      assert.equal(1, response.current_page)
    })
  })

  describe("'redis' type provided to store client information", function() {
    const redisClient = new Redis()

    it(`should correctly get the correct client info, then when sending a kill signal should flush the redis cache`, function(done) {
      this.timeout(5000)

      const port2 = 8999
      const child = fork('./bin/txr-server', [ '-t', 'redis', '-p', port2 ])

      setTimeout(async () => {
        try {
          // noop if an error occurs here for now since we reject
          // this promise when the SIGTERM signal is sent below
          libraryClient({
            command: 'listen',
            username: 'listener-testing123',
            host: `http://localhost:${port2}`
          }).catch(() => {})

          setTimeout(async () => {
            try {
              const response = await request.get({ uri: `http://localhost:${port2}/clients`, json: true })
              assert.equal(1, response.data_length)

              // This should initiate flushing the redis cache for all
              // client info (see ./server.js)
              child.kill('SIGTERM')

              setTimeout(async () => {
                try {
                  const namesJson = await redisClient.get(`txr.names`)
                  done(assert.equal(null, namesJson))
                } catch (e) {
                  child.kill()
                  done(e)
                }
              }, 1000)

            } catch(e) {
              child.kill()
              done(e)
            }
          }, 500)

        } catch(err) {
          child.kill()
          done(err)
        }
      }, 1000)
    })
  })
})
