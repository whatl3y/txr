import io from 'socket.io-client'
import socketStream from 'socket.io-stream'
import config from '../../config'

const NOOP = () => {}

export default async function chat({ client, user, targetUser, host }) {
  const socket    = io.connect(host || config.server.host)
  const clientObj = client({ socket, user, targetUser, host })

  if (!user)
    return clientObj.reject(`Make sure you pass a user (-u or --username) to listen for files that could be sent to you.\n`)

  socket.emit('regiser-listen', { user })

  const listenersRoot   = clientObj.chat
  const normalListeners = listenersRoot.normal
  Object.keys(normalListeners).forEach(listener => socket.on(listener, normalListeners[listener].bind(listenersRoot)))
}
