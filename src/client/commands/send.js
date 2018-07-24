import fs from 'fs'
import path from 'path'
import promisify from 'es6-promisify'
import io from 'socket.io-client'
import socketStream from 'socket.io-stream'
import zd from 'zip-dir'
import FileHelpers from '../../libs/FileHelpers'
import Vomit from '../../libs/Vomit'
import config from '../../config'

const access    = promisify(fs.access)
const lstat     = promisify(fs.lstat)
const writeFile = promisify(fs.writeFile)
const zipdir    = promisify(zd)

export default async function send({ client, file, user, host }) {
  const socket      = io.connect(host || config.server.host)
  const writeStream = socketStream.createStream()
  const clientObj   = client({ socket, socketStream, writeStream, file, user, host })

  const filePathToSend  = file
  const userToSend      = user

  if (!filePathToSend)
    return clientObj.reject(`Make sure you pass an absolute filepath (-f or --file) to send a file.\n`)

  if (!userToSend)
    return clientObj.reject(`Make sure you pass a user (-u or --username) to send a file to.\n`)

  const fileExists = await (async filePath => {
    try {
      await access(filePathToSend)
      return true
    } catch(e) {
      return false
    }
  })(filePathToSend)

  if (!fileExists)
    return clientObj.reject(`We couldn't find a file or directory located in the following location:\n${filePathToSend}\n`)

  const fileStats = await lstat(filePathToSend)
  const isDir     = fileStats.isDirectory()
  const isFile    = fileStats.isFile()
  let fileSize    = fileStats.size

  let finalFilePathOrBuffer, finalFilename, deleteFileAfterSend
  if (isDir) {
    Vomit.success(`We are zipping and sending the directory: ${filePathToSend}. This may take some time depending on how large the directory is...`)
    finalFilePathOrBuffer = await zipdir(filePathToSend)
    finalFilename         = FileHelpers.getFileName(`${filePathToSend}.zip`)
    deleteFileAfterSend   = true
    fileSize              = `${fileSize} (directory)`
  } else if (isFile) {
    finalFilePathOrBuffer = filePathToSend
    finalFilename         = filePathToSend
  } else {
    return clientObj.reject(`The path specified is not a file or directory. The specified path needs to be a file or directory.\n${filePathToSend}\n`)
  }

  const filename          = path.basename(finalFilename)
  const dataForFileToSend = { filename: filename, filesizebytes: fileSize, user: userToSend }

  socket.emit('send-file-check-auth', dataForFileToSend)

  const txrReadStream = fs.createReadStream(finalFilename)
  const listenersRoot = clientObj.send

  listenersRoot.setFinalFilename(finalFilename)
  listenersRoot.setDataForFileToSend(dataForFileToSend)
  listenersRoot.setDeleteFileAfterSend(deleteFileAfterSend)
  const normalListeners = listenersRoot.normal
  const streamListeners = listenersRoot.stream

  Object.keys(normalListeners).forEach(listener => socket.on(listener, normalListeners[listener].bind(listenersRoot)))
  Object.keys(streamListeners).forEach(listener => txrReadStream.on(listener, streamListeners[listener].bind(listenersRoot)))

  txrReadStream.pipe(writeStream)

  if (finalFilePathOrBuffer instanceof Buffer) {    // directory was zipped to a buffer
    await writeFile(finalFilename, finalFilePathOrBuffer)
  }
}
