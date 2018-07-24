
/**
  * reject: function of what to do at the end of the streaming activities if something went WRONG
  * resolve: function of what to do at the end of the streaming activities if everything went RIGHT
**/
const reject = () => {}
const resolve = () => {}

/**
  * Default export needs to be a function that accepts a single object of the following items:
  *   socket: socket created after connecting to the SocketIO server
  *   socketStream: instance of 'socket.io-stream'
  *   writeStream: the write stream created by socketStream where the file
  *               will be piped to from the file read stream
  *   file: path to file that will be send to the listening client
  *   user: username of the listening user to send the file to
  *   auth (OPTIONAL): boolean to indicate whether a listening client wants to require auth to receive a file
  *   host (OPTIONAL): host to connect to the SocketIO server
**/
export default function exampleClientInterface({
  socket,
  socketStream,
  writeStream,
  file,
  user,
  targetUser,
  auth,
  host
}) {
  return {
    reject,
    resolve,

    listen: {
      normal: {

      },

      stream: {

      }
    },

    send: {
      bytesTracker: 0,
      dataForFileToSend: null,
      deleteFileAfterSend: false,
      finalFilename: null,

      setDataForFileToSend(data) {
        return this.dataForFileToSend = data
      },

      setDeleteFileAfterSend(shouldDelete) {
        return this.deleteFileAfterSend = shouldDelete
      },

      setFinalFilename(file) {
        return this.finalFilename = file
      },

      normal: {

      },

      stream: {

      }
    }
  }
}
