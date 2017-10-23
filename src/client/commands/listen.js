import fs from 'fs'
import path from 'path'
import io from 'socket.io-client'
import ss from 'socket.io-stream'
import Vomit from '../../libs/Vomit'
import config from '../../config'

export default async function listen({ file, user }) {
  if (!user)
    return Vomit.error(`Make sure you pass a user (-u or --username) to listen for files that could be sent to you.\n`)

  const socket  = io.connect(config.server.host)
  socket.emit('regiser-listen', { user: user })
  socket.on('user-taken', () => {
    Vomit.error(`The user you chose, ${user}, is already registered with the server. Please try another username.`)
    process.exit()
  })
  socket.on('user-registered-success', name => Vomit.success(`Successfully registered name: ${name}. You are now listening for files.`))

  ss(socket).on('file', function(stream, data={}) {
    Vomit.success(`Received 'file' event with data ${JSON.stringify(data)}`)
    const targetFilePath = path.join(config.filepath, path.basename(data.filename || "file-handler-file"))
    const writeStream = fs.createWriteStream(targetFilePath)

    stream.on('data', chunk => Vomit.success(`Wrote ${chunk.length} bytes of data.`))
    stream.on('error', err => Vomit.error(`Error reading stream: ${err.toString()}`))
    stream.on('end', () => {
      Vomit.success(`Completed receiving file with data: ${JSON.stringify(data)}!`)
      Vomit.success(`Target file path: ${targetFilePath}`)
      // socket.emit('finished-uploading')
    })

    stream.pipe(writeStream)
  })
}
