import fs from 'fs'
import path from 'path'
import promisify from 'es6-promisify'
import FileHelpers from '../../libs/FileHelpers'
import Readline from '../../libs/Readline'
import Vomit from '../../libs/Vomit'
import config from '../../config'

const delFile = promisify(fs.unlink)

const thereWasAnError = message => { Vomit.error.bind(Vomit)(message); process.exit() }
const everythingWorked = process.exit

export default function cliClientInterface({
  socket,
  socketStream,
  writeStream,
  file,
  user,
  targetUser,
  auth,
  host,
  reject,
  resolve
}) {
  reject = reject || thereWasAnError
  resolve = resolve || everythingWorked

  return {
    reject,
    resolve,

    chat: {
      readline: null,

      async waitAndSendMessage() {
        if (this.readline)
          this.readline.close()

        this.readline = Readline()
        const message = await this.readline.ask(`[${user}]: `)
        if ([ 'end', 'exit', 'quit' ].includes(message)) {
          Vomit.success("Goodbye!")
          resolve()
        }

        if (message.length === 0)
          return await this.waitAndSendMessage()

        socket.emit('txr-send-chat-message', { user, targetUser, message })
        await this.waitAndSendMessage()
      },

      normal: {
        'txr-user-taken': function() {
          reject(`The user you chose, ${user}, is already registered with the server. Please try another username.`)
        },

        'txr-destination-user-not-registered': function(user) {
          reject(`(There is no user currently registered with the username ${user}.)`)
        },

        'txr-receive-chat-message': async function({ targetUser, message }) {
          Vomit.chatMessage(`[${targetUser}]: ${message}`)
          await this.waitAndSendMessage()
        },

        'txr-receive-reply': async function({ user, replyMessage }) {
          if (this.readline) {
            this.readline.close()
            this.readonly = null
          }


          Vomit.chatMessage(`[${user}]: ${replyMessage}`)
          await this.waitAndSendMessage()
        },

        'txr-user-registered-success': async function(name) {
          Vomit.success(`Successfully registered name: ${name}. You can now send messages to ${targetUser} below.\n`)
          Vomit.success(`(type 'exit' or 'quit' to stop sending messages)`)
          await this.waitAndSendMessage()
        }
      }
    },

    listen: {
      readline: null,

      async askToReply(targetUser) {
        if (this.readline)
          this.readline.close()

        this.readline = Readline()
        const replyMessage = await this.readline.ask(`reply to ${targetUser} - [${user}]: `)
        if (replyMessage.length > 0) {
          socket.emit('txr-reply-to-chat-message', { user: targetUser, replyMessage })
          Vomit.success(`Thanks, your reply was sent to ${targetUser}!`)
        } else {
          await this.askToReply(targetUser)
        }
      },

      normal: {
        'txr-user-taken': function() {
          reject(`The user you chose, ${user}, is already registered with the server. Please try another username.`)
        },

        'txr-user-registered-success': function(name) {
          Vomit.success(`Successfully registered name: ${name}. You are now listening for files.`)
        },

        'txr-file-permission': async function(fileData) {
          delete(fileData.user)
          const answer = await Readline().ask(`\nSomeone wants to send you a file. Are you okay receiving a file with this data: ${JSON.stringify(fileData)} -- answer (yes/no): `)
          Vomit.success(`You answered '${answer}', we're letting the server and sender know now.`)
          socket.emit('txr-file-permission-response', answer)
        },

        'txr-receive-chat-message': async function({ targetUser, message }) {
          Vomit.chatMessage(`[${targetUser}]: ${message}`)
          await this.askToReply(targetUser)
        },

        'disconnect': function() {
          reject(`You were disconnected from the server.`)
        }
      },

      stream: {
        'txr-file': function(stream, data={}) {
          delete(data.user)
          Vomit.success(`Starting to receive file with data: ${JSON.stringify(data)}`)
          const newFileName     = FileHelpers.getFileName(data.filename || "txr.file")
          const targetFilePath  = path.join(config.filepath, path.basename(newFileName))
          const fileWriteStream = fs.createWriteStream(targetFilePath)

          let bytesTracker = 0

          stream.on('data', chunk => { bytesTracker = bytesTracker + chunk.length; Vomit.progress('.') })
          stream.on('error', err => Vomit.error(`\nError reading stream: ${err.toString()}`))
          stream.on('end', () => {
            Vomit.success(`\nFinished receiving file with data: ${JSON.stringify(data)}`)
            Vomit.success(`Target file path: ${targetFilePath}`)
          })

          stream.pipe(fileWriteStream)
        }
      }
    },

    send: {
      bytesTracker: 0,
      dataForFileToSend: null,
      deleteFileAfterSend: false,
      finalFilename: null,

      async exitGracefully(callback=()=>{}) {
        if (this.deleteFileAfterSend)
          await delFile(this.finalFilename)

        callback()
        resolve()
      },

      normal: {
        'txr-no-user': function(obj) {
          this.exitGracefully(() => Vomit.error(`No user registered with username: ${obj.user}`))
        },

        'txr-file-permission-granted': function() {
          socketStream(socket).emit('txr-upload', writeStream, this.dataForFileToSend)
        },

        'txr-file-permission-waiting': function() {
          Vomit.success(`Waiting for user to grant or reject receiving the file.`)
        },

        'txr-file-permission-denied': function() {
          this.exitGracefully(() => Vomit.error(`User did not grant permission to send file.`))
        },

        'txr-file-data-hash-mismatch': function() {
          this.exitGracefully(() => Vomit.error(`We can't validate the file you're sending.`))
        },

        'txr-finished-uploading': function() {
          this.exitGracefully(() => Vomit.success(`Your file has successfully sent to ${user}!`))
        },

        'disconnect': function() {
          this.exitGracefully(() => Vomit.error(`You were disconnected from the server.`))
        }
      },

      stream: {
        data: function(chunk) {
          this.bytesTracker = this.bytesTracker + chunk.length
          Vomit.progress('.')
        },

        end: function() {
          Vomit.success(`\nAll bytes have been read from file: ${this.finalFilename}.`)
        }
      }
    }
  }
}
