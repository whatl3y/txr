import minimist from 'minimist'
import createClient from '../client'

const argv = minimist(process.argv.slice(2))
const [ first, second, third ] = argv._

;(async function txrCliClient() {
  const typeInterface = argv.i || argv.interface || 'cli'
  const command       = argv.c || argv.command || first
  const file          = argv.f || argv.file || argv.d || argv.dir || second
  const user          = argv.u || argv.username || argv.user || third || second
  const targetUser    = argv.t || argv.target_user || argv.targetUser || third
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
