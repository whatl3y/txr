import http from 'http'
import express from 'express'
import socket_io from 'socket.io'
import bunyan from 'bunyan'
import Redis from 'ioredis'
import listeners, { IListeners } from './listeners'
import Routes from './routes'
import appTypes, { ITxrApp } from './app-types'
import config from '../config'

// import socketStream from 'socket.io-stream'
const socketStream = require('socket.io-stream')

export default function createServer(port: number, opts?: any) {
  const type = opts && opts.type
  const socketApp = getAppType(type)
  const app = express()
  const httpServer = new http.Server(app)
  const log = bunyan.createLogger(config.logger.options)
  const io = socket_io(httpServer)
  const routes = Routes({ app: socketApp })

  io.on('connection', function (socket) {
    log.info(`got socket: ${socket.id}`)

    const ssSocket = socketStream(socket)
    const list: IListeners = listeners(io, socket, socketApp)

    Object.keys(list.normal).forEach((key) =>
      socket.on(key, (list.normal as any)[key])
    )
    Object.keys(list.stream).forEach((key) =>
      ssSocket.on(key, (list.stream as any)[key])
    )
  })

  Object.keys(routes).forEach((method) =>
    app.get(method, (routes as any)[method])
  )
  httpServer.listen(port, () => log.info(`server listening on *: ${port}`))

  return { app, httpServer, socketApp }
}

function getAppType(type: string): ITxrApp {
  switch (type) {
    case 'memory':
      return appTypes.memory()
    case 'redis':
      return appTypes.redis(new Redis(config.redis.url))
    default:
      return getAppType('memory')
  }
}
