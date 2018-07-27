import fs from 'fs'
import path from 'path'
import FileHelpers from '../../libs/FileHelpers'
import config from '../../config'

const NOOP = () => {}

export default function libraryClientInterface({
  socket,
  socketStream,
  writeStream,
  file,
  user,
  targetUser,
  host,
  logger,
  callback,
  reject,
  resolve
}) {
  logger = logger || { debug: NOOP, info: NOOP }

  return {
    reject,
    resolve,

    listen: {
      normal: {
        'txr-user-taken': function() {
          reject(`The user you chose, ${user}, is already registered with the server. Please try another username.`)
        },

        'disconnect': function() {
          reject(`You were disconnected from the server.`)
        }
      },

      stream: {
        'txr-file': function(stream, data={}) {
          const resolveFile     = (typeof callback === 'function') ? callback : resolve
          const newFileName     = FileHelpers.getFileName(data.filename || "txr.file")
          const targetFilePath  = path.join(config.filepath, path.basename(newFileName))
          const fileWriteStream = fs.createWriteStream(targetFilePath)

          let bytesTracker = 0

          stream.on('data', chunk => { bytesTracker = bytesTracker + chunk.length; logger.debug('.') })
          stream.on('error', reject)
          stream.on('end', () => resolveFile(targetFilePath))

          stream.pipe(fileWriteStream)
        }
      }
    },

    send: {
      bytesTracker: 0,
      dataForFileToSend: null,

      normal: {
        'txr-no-user': function(obj) {
          reject(`No user registered with username: ${obj.user}`)
        },

        'txr-file-permission-granted': function() {
          socketStream(socket).emit('txr-upload', writeStream, this.dataForFileToSend)
        },

        'txr-file-permission-waiting': function() {
          logger.info(`Waiting for user to grant or reject receiving the file.`)
        },

        'txr-file-permission-denied': function() {
          reject(`User did not grant permission to send file.`)
        },

        'txr-file-data-hash-mismatch': function() {
          reject(`We can't validate the file you're sending.`)
        },

        'txr-finished-uploading': function() {
          resolve(`Your file has successfully sent to ${user}!`)
        },

        'disconnect': function() {
          reject(`You were disconnected from the server.`)
        }
      },

      stream: {
        data: function(chunk) {
          this.bytesTracker = this.bytesTracker + chunk.length
          logger.debug('.')
        },

        end: function() {
          logger.info(`All bytes have been read from file: ${this.finalFilename}.`)
        }
      }
    }
  }
}
