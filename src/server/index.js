import fs from 'fs'
import path from 'path'
import minimist from 'minimist'
import http from 'http'
import express from 'express'
import socket_io from 'socket.io'
import socketStream from 'socket.io-stream'
import bunyan from 'bunyan'
import listeners from './listeners'
import socketApp from './socketApp.js'
import FileHelpers from '../libs/FileHelpers'
import config from '../config'

const app         = express()
const httpServer  = http.Server(app)
const log         = bunyan.createLogger(config.logger.options)
const argv        = minimist(process.argv.slice(2))

let port  = argv.p || argv.port || config.server.port
port      = (isNaN(port)) ? config.server.port : port
const io  = socket_io(httpServer)

app.get('*', (req, res) => FileHelpers.expressjs.convertReadmeToHtml(res))
httpServer.listen(port, () => log.info(`server listening on *: ${port}`))

io.on('connection', function(socket) {
  log.info(`got socket: ${socket.id}`)

  const ssSocket  = socketStream(socket)
  const list      = listeners(io, socket, socketApp)

  Object.keys(list.normal).forEach(key => socket.on(key, list.normal[key]))
  Object.keys(list.stream).forEach(key => ssSocket.on(key, list.stream[key]))
})
