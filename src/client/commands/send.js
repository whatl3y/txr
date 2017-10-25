import fs from 'fs'
import path from 'path'
import promisify from 'es6-promisify'
import io from 'socket.io-client'
import ss from 'socket.io-stream'
import Vomit from '../../libs/Vomit'
import config from '../../config'

const access  = promisify(fs.access)
const lstat   = promisify(fs.lstat)

export default async function send({ file, user }) {
  const filePathToSend  = file
  const userToSend      = user

  if (!filePathToSend)
    return Vomit.error(`Make sure you pass an absolute filepath (-f or --file) to send a file.\n`)

  if (!userToSend)
    return Vomit.error(`Make sure you pass a user (-u or --username) to send a file to.\n`)

  const fileExists = await (async filePath => {
    try {
      await access(filePathToSend)
      return true
    } catch(e) {
      return false
    }
  })(filePathToSend)
  if (!fileExists)
    return Vomit.error(`We couldn't find a file located in the following location:\n${filePathToSend}\n`)

  const isFile = (await lstat(filePathToSend)).isFile()
  if (!isFile)
    return Vomit.error(`The path specified is not a file. Only files are available to send:\n${filePathToSend}\n`)

  const socket            = io.connect(config.server.host)
  const stream            = ss.createStream()
  const filename          = path.basename(filePathToSend)
  const dataForFileToSend = { filename: filename, user: userToSend }

  socket.emit('send-file-check-auth', dataForFileToSend)
  socket.on('no-user',                  obj => { Vomit.error(`No user registered with username: ${obj.user}`); process.exit() })
  socket.on('file-permission-granted',  () => ss(socket).emit('upload', stream, dataForFileToSend))
  socket.on('file-permission-waiting',  () => Vomit.success(`Waiting for user to grant or reject receiving the file.`))
  socket.on('file-permission-denied',   () => { Vomit.error(`User did not grant permission to send file.`); process.exit() })
  socket.on('finished-uploading',       () => { Vomit.success(`Your file has been sent!`); process.exit() })
  socket.on('disconnect',               () => { Vomit.error(`You were disconnected from the server.`); process.exit() })

  const fileHandoffReadStream = fs.createReadStream(filePathToSend)

  fileHandoffReadStream.on('data', chunk => Vomit.success(`Received ${chunk.length} bytes of data.`))
  fileHandoffReadStream.on('end', () => Vomit.success('Completed sending file!\n'))

  fileHandoffReadStream.pipe(stream)
}
