import minimist from 'minimist'
import Vomit from '../libs/Vomit'
import allCommands from './commands'
import interfaces from './interfaces'

const argv = minimist(process.argv.slice(2))
const [ first, second, third ] = argv._

;(async function createTxrClient() {
  const interf      = argv.i || argv.interface || 'cli'
  const command     = argv.c || argv.command || first
  const file        = argv.f || argv.file || argv.d || argv.dir || second
  const user        = argv.u || argv.username || third || second
  const targetUser  = argv.t || argv.target_user
  const auth        = argv.a || argv.auth
  const host        = argv.h || argv.host

  if (interf && interfaces[interf]) {
    const client = interfaces[interf]
    if (command && allCommands[command]) {
      await allCommands[command]({ client, file, user, targetUser, auth, host })
    }
  }
})()
