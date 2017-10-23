import minimist from 'minimist'
import Vomit from '../libs/Vomit'
import allCommands from './commands'

const argv = minimist(process.argv.slice(2))
const [ first, second, third ] = argv._

;(async function go() {
  const command         = argv.c || argv.command || first
  const filePathToSend  = argv.f || argv.file || second
  const user            = argv.u || argv.username || third || second

  if (command && allCommands[command]) {
    await allCommands[command]({ file: filePathToSend, user: user })
  } else {
    Vomit.error(`Please enter a valid command (-c or --command).`)
  }
})()
