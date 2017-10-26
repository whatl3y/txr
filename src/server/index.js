import fs from 'fs'
import path from 'path'
import minimist from 'minimist'
import socket_io from 'socket.io'
import ss from 'socket.io-stream'
import bunyan from 'bunyan'
import listeners from './listeners'
import socketApp from './socketApp.js'
import config from '../config'

const log   = bunyan.createLogger(config.logger.options)
const argv  = minimist(process.argv.slice(2))

let port    = argv.p || argv.port || config.server.port
port        = (isNaN(port)) ? config.server.port : port
const io    = socket_io().listen(port)
log.info(`socket.io server listening on port: ${port}`)

io.on('connection', function(socket) {
  log.info(`got socket: ${socket.id}`)

  const ssSocket  = ss(socket)
  const list      = listeners(io, socket, socketApp)

  Object.keys(list.normal).forEach(key => socket.on(key, list.normal[key]))
  Object.keys(list.stream).forEach(key => ssSocket.on(key, list.stream[key]))
})
