import fs from 'fs'
import path from 'path'
import io from 'socket.io-client'
import FileHelpers from '../../libs/FileHelpers'
import Vomit from '../../libs/Vomit'
import { ICommandOptions } from './index'
import config from '../../config'

// import socketStream from 'socket.io-stream'
const socketStream = require('socket.io-stream')
// import zd from 'zip-dir'
const zd = require('zip-dir')

const access = fs.promises.access
const lstat = fs.promises.lstat
const writeFile = fs.promises.writeFile
const zipdir = async function (dir: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    zd(dir, (err: Error, buffer: Buffer) => {
      if (err) return reject(err)
      resolve(buffer)
    })
  })
}

export default async function send({
  client,
  file,
  user,
  host,
  reject,
  resolve,
}: ICommandOptions) {
  const socket = io.connect(host || config.server.host)
  const writeStream = socketStream.createStream(null)
  const clientObj = client({
    socket,
    socketStream,
    writeStream,
    file,
    user,
    host,
    reject,
    resolve,
  })

  const filePathToSend = file
  const userToSend = user

  if (!filePathToSend)
    return clientObj.reject(
      `Make sure you pass an absolute filepath (-f or --file) to send a file.\n`
    )

  if (!userToSend)
    return clientObj.reject(
      `Make sure you pass a user (-u or --username) to send a file to.\n`
    )

  const fileExists = await (async (filePath) => {
    try {
      await access(filePathToSend)
      return true
    } catch (e) {
      return false
    }
  })(filePathToSend)

  if (!fileExists)
    return clientObj.reject(
      `We couldn't find a file or directory located in the following location:\n${filePathToSend}\n`
    )

  const fileStats = await lstat(filePathToSend)
  const isDir = fileStats.isDirectory()
  const isFile = fileStats.isFile()
  let fileSize: number | string = fileStats.size

  let finalFilePathOrBuffer, finalFilename, deleteFileAfterSend
  if (isDir) {
    Vomit.success(
      `We are zipping and sending the directory: ${filePathToSend}. This may take some time depending on how large the directory is...`
    )
    finalFilePathOrBuffer = await zipdir(filePathToSend)
    finalFilename = FileHelpers.getFileName(`${filePathToSend}.zip`)
    deleteFileAfterSend = true
    fileSize = `${fileSize} (directory)`
  } else if (isFile) {
    finalFilePathOrBuffer = filePathToSend
    finalFilename = filePathToSend
  } else {
    return clientObj.reject(
      `The path specified is not a file or directory. The specified path needs to be a file or directory.\n${filePathToSend}\n`
    )
  }

  // Needs to be before creating the txrReadStream so the file
  // will exist on disk before beginning to stream data over
  if (finalFilePathOrBuffer instanceof Buffer) {
    // directory was zipped to a buffer
    await writeFile(finalFilename, finalFilePathOrBuffer)
  }

  const filename = path.basename(finalFilename)
  const dataForFileToSend = {
    filename: filename,
    filesizebytes: fileSize,
    user: userToSend,
  }

  socket.emit('txr-send-file-check-auth', dataForFileToSend)

  const txrReadStream = fs.createReadStream(finalFilename)
  const listenersRoot = clientObj.send

  listenersRoot.finalFilename = finalFilename
  listenersRoot.dataForFileToSend = dataForFileToSend
  listenersRoot.deleteFileAfterSend = deleteFileAfterSend
  const normalListeners = listenersRoot.normal
  const streamListeners = listenersRoot.stream

  Object.keys(normalListeners).forEach((listener) =>
    socket.on(listener, normalListeners[listener].bind(listenersRoot))
  )
  Object.keys(streamListeners).forEach((listener) =>
    txrReadStream.on(listener, streamListeners[listener].bind(listenersRoot))
  )

  txrReadStream.pipe(writeStream)
}
