import fs from 'fs'
import path from 'path'
import socket_io from 'socket.io'
import ss from 'socket.io-stream'
import bunyan from 'bunyan'
import listeners from './listeners'
import socketApp from './socketApp.js'
import config from '../config'

const log = bunyan.createLogger(config.logger.options)
const io  = socket_io().listen(config.server.port)

io.on('connection', function(socket) {
  log.info(`got socket: ${socket.id}`)

  const ssSocket  = ss(socket)
  const list      = listeners(io, socket, socketApp)

  Object.keys(list.normal).forEach(key => socket.on(key, list.normal[key]))
  Object.keys(list.stream).forEach(key => ssSocket.on(key, list.stream[key]))
})
