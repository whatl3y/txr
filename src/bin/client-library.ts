import minimist from 'minimist'
import createClient from '../client'

export default async function txrLibraryClient(argv: minimist.ParsedArgs) {
  return await new Promise(async (resolve, reject) => {
    const typeInterface = 'library'
    const command = argv.c || argv.command
    const file = argv.f || argv.file || argv.d || argv.dir
    const user = argv.u || argv.username || argv.user
    const targetUser = argv.t || argv.target_user || argv.targetUser
    const auth = argv.a || argv.auth
    const host = argv.h || argv.host
    const logger = argv.l || argv.logger
    const callback = argv.callback

    // TODO: should we do more validation here for inputs?

    try {
      await createClient({
        typeInterface, // 'cli' or 'library'
        command, // 'send', 'listen', or 'chat'
        file, // filepath on file system to send to listening user
        user, // username to register (if listening) or send file to if sending
        targetUser, // username to send chat message to, if command == 'chat'
        auth, // if listening and 'cli' interface, whether to request confirmation on receiving a file
        host, // host of server to connect to
        logger, // node-bunyan logging interface if interface == 'library'
        callback, // if provided and using 'library' interface, will be a callback to invoke INSTEAD OF `resolve` when receiving a file as a listening client
        reject, // function to invoke if something goes wrong
        resolve, // function to invoke after everything goes right and we're done
      })
    } catch (err) {
      reject(err)
    }
  })
}
