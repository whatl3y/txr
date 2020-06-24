import { ITxrApp } from './index'

export default function memoryApp(): ITxrApp {
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
      },
    },

    async set(namespace: string, key: string, value: string) {
      return (this.app[namespace][key] = value)
    },

    async get(namespace: string, key: null | string = null) {
      return key ? this.app[namespace][key] : this.app[namespace]
    },

    async del(namespace: string, key: string) {
      delete this.app[namespace][key]
    },
  }
}
