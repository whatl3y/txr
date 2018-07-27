import io from 'socket.io-client'
import socketStream from 'socket.io-stream'
import config from '../../config'

export default async function chat({ client, user, targetUser, host, reject, resolve }) {
  const socket    = io.connect(host || config.server.host)
  const clientObj = client({ socket, user, targetUser, host, reject, resolve })

  if (!user)
    return clientObj.reject(`Make sure you pass a user (-u or --username) to listen for files that could be sent to you.\n`)
  if (!targetUser)
    return clientObj.reject(`Make sure you pass a target user (-t or --target_user) to send chat messages to.\n`)

  socket.emit('txr-regiser-listen', { user })

  const listenersRoot = clientObj.chat
  if (!listenersRoot)
    return clientObj.reject(`The interface provided does not support the chat command.\n`)

  const normalListeners = listenersRoot.normal
  Object.keys(normalListeners).forEach(listener => socket.on(listener, normalListeners[listener].bind(listenersRoot)))
}
