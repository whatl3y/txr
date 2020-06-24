import bunyan from 'bunyan'
import socketIo from 'socket.io'
import Encryption from '../../libs/Encryption'
import config from '../../config'
import { Readable } from 'stream'

// import ss from 'socket.io-stream'
const ss = require('socket.io-stream')

const log = bunyan.createLogger(config.logger.options)

export interface IListeners {
  normal: INormalListers
  stream: IStreamListeners
}

export default function listeners(
  io: socketIo.Server,
  socket: socketIo.Socket,
  socketApp: any
): IListeners {
  return {
    normal: {
      'txr-regiser-listen': async function ({
        auth,
        user,
      }: IRegsiterListenOpts) {
        if (await socketApp.get('names', user)) {
          socket.emit('txr-user-taken', true)
          log.error(`User could not register name: ${user}`)
        } else {
          await Promise.all([
            socketApp.set('names', user, socket.id),
            socketApp.set('ids', socket.id, user),
            socketApp.set('auth', socket.id, !!auth),
          ])

          socket.emit('txr-user-registered-success', user)
          log.info(`User successfully registered name: ${user}`)
        }
      },

      'txr-send-file-check-auth': async function ({
        filename,
        filesizebytes,
        user,
      }: ISendFileCheckAuthOpts) {
        const destinationSocketId = await socketApp.get('names', user)
        const sendingRequiresAuth = await socketApp.get(
          'auth',
          destinationSocketId
        )
        const dataHash = Encryption.stringToHash(
          JSON.stringify({ filename, filesizebytes, user })
        )

        if (user && destinationSocketId) {
          const destinationSocket = io.sockets.connected[destinationSocketId]

          if (sendingRequiresAuth) {
            socket.emit('txr-file-permission-waiting')
            destinationSocket.on('file-permission-response', async (answer) => {
              if (answer.toLowerCase() === 'yes') {
                await socketApp.set('unlocked', dataHash, socket.id)
                socket.emit('txr-file-permission-granted')
              } else {
                socket.emit('txr-file-permission-denied')
              }
            })
            destinationSocket.emit('txr-file-permission', {
              filename,
              filesizebytes,
              user,
            })
          } else {
            await socketApp.set('unlocked', dataHash, socket.id)
            socket.emit('txr-file-permission-granted')
          }
        } else {
          log.error(`Tried to send a file to '${user}' who has not registered.`)
          socket.emit('txr-no-user', { user })
        }
      },

      'txr-send-chat-message': async function ({
        targetUser,
        user,
        message,
      }: ISendChatMessageOpts) {
        const destinationSocketId = await socketApp.get('names', targetUser)
        if (!destinationSocketId) {
          socket.emit('txr-destination-user-not-registered', targetUser)
          return
        }

        const destinationSocket = io.sockets.connected[destinationSocketId]
        destinationSocket.emit('txr-receive-chat-message', {
          targetUser: user,
          message,
        })
      },

      'txr-reply-to-chat-message': async function ({
        user,
        replyMessage,
      }: IReplyToChatMessageOpts) {
        const [replyingUserName, destinationSocketId] = await Promise.all([
          socketApp.get('ids', socket.id),
          socketApp.get('names', user),
        ])
        if (destinationSocketId) {
          const destinationSocket = io.sockets.connected[destinationSocketId]
          destinationSocket.emit('txr-receive-reply', {
            user: replyingUserName,
            replyMessage,
          })
        }
      },

      disconnect: async function () {
        log.info(`socket disconnected: ${socket.id}`)
        const name = await socketApp.get('ids', socket.id)
        await Promise.all([
          socketApp.del('ids', socket.id),
          socketApp.del('auth', socket.id),
          socketApp.del('names', name),
        ])
      },
    },

    stream: {
      'txr-upload': async function (stream, data) {
        log.info(`Received 'upload' event with data: ${JSON.stringify(data)}`)

        const userToSend = data.user
        const destinationSocketId = await socketApp.get('names', userToSend)
        const dataHash = Encryption.stringToHash(JSON.stringify(data))
        if (userToSend && destinationSocketId) {
          const unlockedSocketId = await socketApp.get('unlocked', dataHash)
          if (unlockedSocketId && unlockedSocketId == socket.id) {
            const destinationSocket = io.sockets.connected[destinationSocketId]
            const destinationStream = ss.createStream()

            stream.on('data', (chunk) =>
              log.info(`Received ${chunk.length} bytes of data.`)
            )
            stream.on('error', (err) => log.error(`socket: ${socket.id}`, err))
            stream.on('end', () =>
              log.info(
                `Completed receiving file with data: ${JSON.stringify(data)}!`
              )
            )

            destinationStream.on('end', () =>
              socket.emit('txr-finished-uploading')
            )
            stream.pipe(destinationStream)
            ss(destinationSocket).emit('txr-file', destinationStream, data)
          } else {
            socket.emit('txr-file-data-hash-mismatch')
          }
          await socketApp.del('unlocked', dataHash)
        } else {
          log.error(
            `Tried to send a file to '${userToSend}' who has not registered.`
          )
          socket.emit('txr-no-user', { user: userToSend })
        }
      },
    },
  }
}

interface INormalListers {
  'txr-regiser-listen': (opts: IRegsiterListenOpts) => Promise<void>
  'txr-send-file-check-auth': (opts: ISendFileCheckAuthOpts) => Promise<void>
  'txr-send-chat-message': (opts: ISendChatMessageOpts) => Promise<void>
  'txr-reply-to-chat-message': (opts: IReplyToChatMessageOpts) => Promise<void>
  disconnect: () => Promise<void>
}

interface IStreamListeners {
  'txr-upload': (stream: Readable, data: any) => Promise<void>
}

interface IRegsiterListenOpts {
  auth: boolean
  user: string
}

interface ISendFileCheckAuthOpts {
  filename: string
  filesizebytes: number
  user: string
}

interface ISendChatMessageOpts {
  targetUser: string
  user: string
  message: string
}

interface IReplyToChatMessageOpts {
  user: string
  replyMessage: string
}
