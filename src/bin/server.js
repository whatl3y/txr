import minimist from 'minimist'
import createServer from '../server'
import config from '../config'

const argv  = minimist(process.argv.slice(2))
let port    = argv.p || argv.port || config.server.port
port        = (isNaN(port)) ? config.server.port : port

;(async function createTxrServer() {
  await createServer(port)
})()
