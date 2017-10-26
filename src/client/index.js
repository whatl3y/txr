import minimist from 'minimist'
import Vomit from '../libs/Vomit'
import allCommands from './commands'

const argv = minimist(process.argv.slice(2))
const [ first, second, third ] = argv._

;(async function go() {
  const command         = argv.c || argv.command || first
  const file            = argv.f || argv.file || second
  const user            = argv.u || argv.username || third || second
  const auth            = argv.a || argv.auth
  const host            = argv.h || argv.host

  if (command && allCommands[command]) {
    await allCommands[command]({ file, user, auth, host })
  } else {
    Vomit.error(`Please enter a valid command (-c or --command).`)
  }
})()
