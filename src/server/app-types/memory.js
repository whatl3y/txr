export default function memoryApp() {
  return {
    app: {
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
    },

    async set(namespace, key, value) {
      return this.app[namespace][key] = value
    },

    async get(namespace, key=null) {
      return (key) ? this.app[namespace][key] : this.app[namespace]
    },

    async del(namespace, key) {
      delete(this.app[namespace][key])
    }
  }
}
