import bunyan from 'bunyan'
import ss from 'socket.io-stream'
import config from '../../config'

const log = bunyan.createLogger(config.logger.options)

export default function listeners(io, socket, socketApp) {
  return {
    normal: {
      'regiser-listen': function({ auth, user }) {
        if (socketApp['names'][user]) {
          socket.emit('user-taken', true)
          log.error(`User could not register name: ${user}`)
        } else {
          socketApp['names'][user] = socket.id
          socketApp['ids'][socket.id] = user
          socketApp['auth'][socket.id] = !!auth

          socket.emit('user-registered-success', user)
          log.info(`User successfully registered name: ${user}`)
        }
      },

      'send-file-check-auth': function({ filename, user }) {
        const destinationSocketId = socketApp['names'][user]
        const sendingRequiresAuth = socketApp['auth'][destinationSocketId]
        if (user && destinationSocketId) {
          const destinationSocket = io.sockets.connected[destinationSocketId]

          if (sendingRequiresAuth) {
              socket.emit('file-permission-waiting')
              destinationSocket.on('file-permission-response', answer => {
                if (answer.toLowerCase() === 'yes') {
                  socket.emit('file-permission-granted')
                } else {
                  socket.emit('file-permission-denied')
                }
              })
              destinationSocket.emit('file-permission', { filename, user })
          } else {
            socket.emit('file-permission-granted')
          }

        } else {
          log.error(`Tried to send a file to '${user}' who has not registered.`)
          socket.emit('no-user', { user })
        }
      },

      'disconnect': function() {
        log.info(`socket disconnected: ${socket.id}`)
        const name = socketApp['ids'][socket.id]
        delete(socketApp['ids'][socket.id])
        delete(socketApp['auth'][socket.id])
        delete(socketApp['names'][name])
      }
    },

    stream: {
      'upload': function(stream, data) {
        log.info(`Received 'upload' event with data: ${JSON.stringify(data)}`)

        const userToSend          = data.user
        const destinationSocketId = socketApp['names'][userToSend]
        if (userToSend && destinationSocketId) {
          const destinationSocket = io.sockets.connected[destinationSocketId]
          const destinationStream = ss.createStream()

          stream.on('data', chunk => log.info(`Received ${chunk.length} bytes of data.`))
          stream.on('error', err => log.error(`socket: ${socket.id}`, err))
          stream.on('end', () => log.info(`Completed receiving file with data: ${JSON.stringify(data)}!`))

          destinationStream.on('end', () => socket.emit('finished-uploading'))
          stream.pipe(destinationStream)
          ss(destinationSocket).emit('file', destinationStream, data)

        } else {
          log.error(`Tried to send a file to '${userToSend}' who has not registered.`)
          socket.emit('no-user', { user: userToSend })
        }
      }
    }
  }
}
