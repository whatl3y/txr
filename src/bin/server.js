import minimist from 'minimist'
import createServer from '../server'
import config from '../config'

const NOOP  = () => {}
const argv  = minimist(process.argv.slice(2))
const type  = argv.t || argv.type || 'memory'
let port    = argv.p || argv.port || config.server.port
port        = (isNaN(port)) ? config.server.port : port

;(async function createTxrServer() {
  const { socketApp } = await createServer(port, { type })

  //handle signals saying for the server to die
  process.on('SIGINT', () => stopAndTerminateServer(socketApp.flush))
  process.on('SIGTERM', () => stopAndTerminateServer(socketApp.flush))
})()

async function stopAndTerminateServer(asyncFunctionToGracefullExit=NOOP) {
  if (typeof asyncFunctionToGracefullExit === 'function')
    await asyncFunctionToGracefullExit()
  process.exit()
}
