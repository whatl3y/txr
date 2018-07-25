import io from 'socket.io-client'
import socketStream from 'socket.io-stream'
import config from '../../config'

export default async function listen({ client, file, user, auth, host, reject, resolve }) {
  const socket    = io.connect(host || config.server.host)
  const clientObj = client({ socket, socketStream, file, user, auth, host, reject, resolve })

  if (!user)
    return clientObj.reject(`Make sure you pass a user (-u or --username) to listen for files that could be sent to you.\n`)

  socket.emit('txr-regiser-listen', { user, auth })

  const listenersRoot   = clientObj.listen
  const normalListeners = listenersRoot.normal
  const streamListeners = listenersRoot.stream

  Object.keys(normalListeners).forEach(listener => socket.on(listener, normalListeners[listener].bind(listenersRoot)))
  Object.keys(streamListeners).forEach(listener => socketStream(socket).on(listener, streamListeners[listener].bind(listenersRoot)))
}
