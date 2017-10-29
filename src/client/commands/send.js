import fs from 'fs'
import path from 'path'
import promisify from 'es6-promisify'
import io from 'socket.io-client'
import ss from 'socket.io-stream'
import zd from 'zip-dir'
import FileHelpers from '../../libs/FileHelpers'
import Vomit from '../../libs/Vomit'
import config from '../../config'

const access    = promisify(fs.access)
const lstat     = promisify(fs.lstat)
const delFile   = promisify(fs.unlink)
const writeFile = promisify(fs.writeFile)
const zipdir    = promisify(zd)

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

  let finalFilePathOrBuffer, finalFilename, deleteFileAfterSend
  if (isDir) {
    Vomit.success(`We are zipping and sending the directory: ${filePathToSend}. This may take some time depending on how large the directory is...`)
    finalFilePathOrBuffer = await zipdir(filePathToSend)
    finalFilename         = FileHelpers.getFileName(`${filePathToSend}.zip`)
    deleteFileAfterSend   = true
  } else if (isFile) {
    finalFilePathOrBuffer = filePathToSend
    finalFilename         = filePathToSend
  } else {
    return Vomit.error(`The path specified is not a file or directory. The specified path needs to be a file or directory.\n${filePathToSend}\n`)
  }

  const socket            = io.connect(host || config.server.host)
  const stream            = ss.createStream()
  const filename          = path.basename(finalFilename)
  const dataForFileToSend = { filename: filename, filesizebytes: fileSize, user: userToSend }

  socket.emit('send-file-check-auth', dataForFileToSend)
  socket.on('no-user',                  obj => { exitGracefully(() => Vomit.error(`No user registered with username: ${obj.user}`)) })
  socket.on('file-permission-granted',  () => ss(socket).emit('upload', stream, dataForFileToSend))
  socket.on('file-permission-waiting',  () => Vomit.success(`Waiting for user to grant or reject receiving the file.`))
  socket.on('file-permission-denied',   () => { exitGracefully(() => Vomit.error(`User did not grant permission to send file.`)) })
  socket.on('file-data-hash-mismatch',  () => { exitGracefully(() => Vomit.error(`We can't validate the file you're sending.`)) })
  socket.on('finished-uploading',       () => { exitGracefully(() => Vomit.success(`Your file has successfully sent to ${userToSend}!`)) })
  socket.on('disconnect',               () => { exitGracefully(() => Vomit.error(`You were disconnected from the server.`)) })

  if (finalFilePathOrBuffer instanceof Buffer) {    // directory was zipped to a buffer
    await writeFile(finalFilename, finalFilePathOrBuffer)
  }

  const txrReadStream = fs.createReadStream(finalFilename)
  let bytesTracker = 0

  txrReadStream.on('data', chunk => { bytesTracker = bytesTracker + chunk.length; Vomit.progress('.') })
  txrReadStream.on('end', () => Vomit.success(`\nAll bytes have been read from file: ${finalFilename}.`))

  txrReadStream.pipe(stream)

  async function exitGracefully(callback=()=>{}) {
    if (deleteFileAfterSend)
      await delFile(finalFilename)

    callback()
    process.exit()
  }
}
