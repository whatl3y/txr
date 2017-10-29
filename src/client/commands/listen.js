import fs from 'fs'
import path from 'path'
import io from 'socket.io-client'
import ss from 'socket.io-stream'
import FileHelpers from '../../libs/FileHelpers'
import Readline from '../../libs/Readline'
import Vomit from '../../libs/Vomit'
import config from '../../config'

export default async function listen({ file, user, auth, host }) {
  if (!user)
    return Vomit.error(`Make sure you pass a user (-u or --username) to listen for files that could be sent to you.\n`)

  const socket  = io.connect(host || config.server.host)
  socket.emit('regiser-listen', { user, auth })

  socket.on('user-taken', () => {
    Vomit.error(`The user you chose, ${user}, is already registered with the server. Please try another username.`)
    process.exit()
  })

  socket.on('user-registered-success', name => {
    Vomit.success(`Successfully registered name: ${name}. You are now listening for files.`)
  })

  socket.on('file-permission', async fileData => {
    const answer = await Readline().ask(`\nSomeone wants to send you a file. Are you okay receiving a file with this data: ${JSON.stringify(fileData)} -- answer (yes/no): `)
    Vomit.success(`You answered '${answer}', we're letting the server know now.`)
    socket.emit('file-permission-response', answer)
  })

  socket.on('disconnect', () => { Vomit.error(`You were disconnected from the server.`); process.exit() })

  ss(socket).on('file', function(stream, data={}) {
    Vomit.success(`Starting to receive file with data: ${JSON.stringify(data)}`)
    const newFileName     = FileHelpers.getFileName(data.filename || "txr.file")
    const targetFilePath  = path.join(config.filepath, path.basename(newFileName))
    const writeStream     = fs.createWriteStream(targetFilePath)

    let bytesTracker = 0

    stream.on('data', chunk => { bytesTracker = bytesTracker + chunk.length; Vomit.progress('.') })
    stream.on('error', err => Vomit.error(`\nError reading stream: ${err.toString()}`))
    stream.on('end', () => {
      Vomit.success(`\nFinished receiving file with data: ${JSON.stringify(data)}`)
      Vomit.success(`Target file path: ${targetFilePath}`)
    })

    stream.pipe(writeStream)
  })
}
