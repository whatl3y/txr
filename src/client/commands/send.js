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
    return Vomit.error(`The parth specified is not a file. Only files are available to send:\n${filePathToSend}\n`)

  const socket    = io.connect(config.server.host)
  const stream    = ss.createStream()
  const filename  = path.basename(filePathToSend)

  ss(socket).emit('upload', stream, { filename: filename, user: userToSend })
  socket.on('no-user', obj => { Vomit.error(`No user registered with username: ${obj.user}`); process.exit() })
  socket.on('finished-uploading', () => process.exit())

  const fileHandoffReadStream = fs.createReadStream(filePathToSend)

  fileHandoffReadStream.on('data', chunk => Vomit.success(`Received ${chunk.length} bytes of data.`))
  fileHandoffReadStream.on('end', () => Vomit.success('Completed sending file!\n'))

  fileHandoffReadStream.pipe(stream)
}
