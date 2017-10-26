import fs from 'fs'
import path from 'path'
import promisify from 'es6-promisify'
import io from 'socket.io-client'
import ss from 'socket.io-stream'
import streamifier from 'streamifier'
import zd from 'zip-dir'
import Vomit from '../../libs/Vomit'
import config from '../../config'

const access  = promisify(fs.access)
const lstat   = promisify(fs.lstat)
const zipdir  = promisify(zd)

export default async function send({ file, user, host }) {
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
    return Vomit.error(`We couldn't find a file or directory located in the following location:\n${filePathToSend}\n`)

  const fileStats = await lstat(filePathToSend)
  const isDir     = fileStats.isDirectory()
  const isFile    = fileStats.isFile()
  const fileSize  = fileStats.size

  let finalFilePathOrBuffer, finalFilename
  if (isDir) {
    finalFilePathOrBuffer = await zipdir(filePathToSend)
    finalFilename         = `${filePathToSend}.zip`
  } else if (!isFile) {
    return Vomit.error(`The path specified is not a file or directory. The specified path needs to be a file or directory.\n${filePathToSend}\n`)
  } else {
    finalFilePathOrBuffer = filePathToSend
    finalFilename         = filePathToSend
  }

  const socket            = io.connect(host || config.server.host)
  const stream            = ss.createStream()
  const filename          = path.basename(finalFilename)
  const dataForFileToSend = { filename: filename, filesizebytes: fileSize, user: userToSend }

  socket.emit('send-file-check-auth', dataForFileToSend)
  socket.on('no-user',                  obj => { Vomit.error(`No user registered with username: ${obj.user}`); process.exit() })
  socket.on('file-permission-granted',  () => ss(socket).emit('upload', stream, dataForFileToSend))
  socket.on('file-permission-waiting',  () => Vomit.success(`Waiting for user to grant or reject receiving the file.`))
  socket.on('file-permission-denied',   () => { Vomit.error(`User did not grant permission to send file.`); process.exit() })
  socket.on('file-data-hash-mismatch',  () => { Vomit.error(`We can't validate the file you're sending.`); process.exit() })
  socket.on('finished-uploading',       () => { Vomit.success(`Your file has successfully sent to ${userToSend}!`); process.exit() })
  socket.on('disconnect',               () => { Vomit.error(`You were disconnected from the server.`); process.exit() })

  const txrReadStream = (finalFilePathOrBuffer instanceof Buffer)
    ? streamifier.createReadStream(finalFilePathOrBuffer)
    : fs.createReadStream(finalFilePathOrBuffer)
  let numTimes = 1

  txrReadStream.on('data', chunk => { Vomit.success(`${numTimes}. Got ${chunk.length} bytes of data from the file.`); numTimes++; })
  txrReadStream.on('end', () => Vomit.success(`All bytes have been read from file: ${finalFilename}.`))

  txrReadStream.pipe(stream)
}
