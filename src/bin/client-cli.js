import minimist from 'minimist'
import createClient from '../client'

const argv = minimist(process.argv.slice(2))
const [ first, second, third ] = argv._

;(async function txrClientCli() {
  const typeInterface = argv.i || argv.interface || 'cli'
  const command       = argv.c || argv.command || first
  const file          = argv.f || argv.file || argv.d || argv.dir || second
  const user          = argv.u || argv.username || third || second
  const targetUser    = argv.t || argv.target_user || third
  const auth          = argv.a || argv.auth
  const host          = argv.h || argv.host

  await createClient({
    typeInterface,
    command,
    file,
    user,
    targetUser,
    auth,
    host
  })
})()
