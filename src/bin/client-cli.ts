import minimist from 'minimist'
import createClient from '../client'

const argv = minimist(process.argv.slice(2))
const [first, second, third] = argv._

;(async function txrCliClient() {
  const typeInterface = 'cli'
  const command = argv.c || argv.command || first
  const file = argv.f || argv.file || argv.d || argv.dir || second
  const user = argv.u || argv.username || argv.user || third || second
  const targetUser = argv.t || argv.target_user || argv.targetUser || third
  const auth = argv.a || argv.auth
  const host = argv.h || argv.host

  await createClient({
    typeInterface, // 'cli' or 'library'
    command, // 'send', 'listen', or 'chat'
    file, // filepath on file system to send to listening user
    user, // username to register (if listening) or send file to if sending
    targetUser, // username to send chat message to, if command == 'chat'
    auth, // if listening and 'cli' interface, whether to request confirmation on receiving a file
    host, // host of server to connect to
  })
})()
