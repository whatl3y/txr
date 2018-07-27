/**
  * Default export needs to be a function that accepts a single object of the following items:
  *   socket: socket created after connecting to the SocketIO server
  *   socketStream: instance of 'socket.io-stream'
  *   writeStream: the write stream created by socketStream [i.e. `require('socket.io-stream')`]
  *               where the file will be piped to from the file read stream
  *   file: path to file that will be send to the listening client
  *   user: username of the listening user to send the file to
  *   targetUser (OPTIONAL): the user you're sending chat messages to if setting up a chat client
  *   auth (OPTIONAL): boolean to indicate whether a listening client wants to require auth to receive a file
  *   host (OPTIONAL): host to connect to the SocketIO server
  *   logger (OPTIONAL): [Library-only] A logger implementing node-bunyan's logging interface to log information when sending/receiving files using the library
  *   reject: function of what to do at the end of the streaming activities if something went WRONG
  *   resolve: function of what to do at the end of the streaming activities if everything went RIGHT
**/
export default function exampleClientInterface({
  socket,
  socketStream,
  writeStream,
  file,
  user,
  targetUser,
  auth,
  host,
  logger,
  reject,
  resolve
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
      normal: {

      },

      // Any listeners in here are events from a ReadStream
      // created by 'fs.createReadStream'
      stream: {

      }
    }
  }
}
