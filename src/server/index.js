import fs from 'fs'
import path from 'path'
import socket_io from 'socket.io'
import ss from 'socket.io-stream'
import streamifier from 'streamifier'
import bunyan from 'bunyan'
import config from '../config'

const log = bunyan.createLogger(config.logger.options)
const io = socket_io().listen(config.server.port)
let socketNamesMap = { names: {}, ids: {} }

io.on('connection', function(socket) {
  log.info(`got socket: ${socket.id}`)
  socket.on('regiser-listen', ({ user }) => {
    if (socketNamesMap['names'][user]) {
      socket.emit('user-taken', true)
      log.error(`User could not register name: ${user}`)
    } else {
      socketNamesMap['names'][user] = socket.id
      socketNamesMap['ids'][socket.id] = user
      socket.emit('user-registered-success', user)
      log.info(`User successfully registered name: ${user}`)
    }
  })

  socket.on('disconnect', () => {
    log.info(`socket disconnected: ${socket.id}`)
    const name = socketNamesMap['ids'][socket.id]
    delete(socketNamesMap['ids'][socket.id])
    delete(socketNamesMap['names'][name])
  })

  ss(socket).on('upload', function(stream, data={}) {
    log.info(`Received 'upload' event with data: ${JSON.stringify(data)}`)

    const userToSend = data.user
    if (userToSend && socketNamesMap['names'][userToSend]) {
      const destinationStream = ss.createStream()

      stream.on('data', chunk => log.info(`Received ${chunk.length} bytes of data.`))
      stream.on('error', err => log.error(`socket: ${socket.id}`, err))
      stream.on('end', () => {
        log.info(`Completed receiving file with data: ${JSON.stringify(data)}!`)
        socket.emit('finished-uploading')
      })

      stream.pipe(destinationStream)
      ss(io.sockets.connected[socketNamesMap['names'][userToSend]]).emit('file', destinationStream, data)

    } else {
      log.error(`Tried to send a file to '${userToSend}' who has not registered.`)
      socket.emit('no-user', { user: userToSend })
    }
  })
})
