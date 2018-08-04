import http from 'http'
import express from 'express'
import socket_io from 'socket.io'
import socketStream from 'socket.io-stream'
import bunyan from 'bunyan'
import Redis from 'ioredis'
import listeners from './listeners'
import Routes from './routes.js'
import appTypes from './app-types'
import config from '../config'

export default function createServer(port, { type }={}) {
  const socketApp   = getAppType(type)
  const app         = express()
  const httpServer  = http.Server(app)
  const log         = bunyan.createLogger(config.logger.options)
  const io          = socket_io(httpServer)
  const routes      = Routes({ app: socketApp })

  io.on('connection', function(socket) {
    log.info(`got socket: ${socket.id}`)

    const ssSocket  = socketStream(socket)
    const list      = listeners(io, socket, socketApp)

    Object.keys(list.normal).forEach(key => socket.on(key, list.normal[key]))
    Object.keys(list.stream).forEach(key => ssSocket.on(key, list.stream[key]))
  })

  Object.keys(routes).forEach(method => app.get(method, routes[method]))
  httpServer.listen(port, () => log.info(`server listening on *: ${port}`))

  return { app, httpServer, socketApp }
}

function getAppType(type) {
  switch(type) {
    case 'memory':
      return appTypes.memory()
    case 'redis':
      return appTypes.redis(new Redis(config.redis.url))
    default:
      return getAppType('memory')
  }
}
