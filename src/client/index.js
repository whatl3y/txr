import allCommands from './commands'
import interfaces from './interfaces'

export default async function createClient({
  typeInterface,  // 'cli' or 'library'
  command,        // 'send', 'listen', or 'chat'
  file,           // filepath on file system to send to listening user
  user,           // username to register (if listening) or send file to if sending
  targetUser,     // username to send chat message to, if command == 'chat'
  auth,           // if listening and 'cli' interface, whether to request confirmation on receiving a file
  host,           // host of server to connect to
  logger,         // node-bunyan logging interface if interface == 'library'
  callback,       // if provided and using 'library' interface, will be a callback to invoke INSTEAD OF `resolve` when receiving a file as a listening client
  reject,         // function to invoke if something goes wrong
  resolve         // function to invoke after everything goes right and we're done
}) {
  if (typeInterface && interfaces[typeInterface]) {
    const client = interfaces[typeInterface]
    if (command && allCommands[command]) {
      await allCommands[command]({ client, file, user, targetUser, auth, host, logger, callback, reject, resolve })
    } else {
      throw new Error(`We don't recognize the command provided: ${command}`)
    }
  } else {
    throw new Error(`We don't recognize the interface provided: ${typeInterface}`)
  }
}
