export default {
  names: {
    // holds key/value pairs - name: socket.id
  },
  ids: {
    // holds key/value pairs - socket.id: name
  },
  auth: {
    // holds key/value pairs - socket.id: true/false, where the boolean
    // determines if a listening user wants to be notified before
    // a file is sent to her
  },
  unlocked: {
    // holds key/value pairs - [hash]: socket.id, where the hash
    // is an md5 hash from the stringified object that defined the
    // data wanting to be send by the sending client to the listener.
  }
}
