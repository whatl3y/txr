import allCommands from './commands'
import interfaces from './interfaces'

export default async function createClient({
  typeInterface,
  command,
  file,
  user,
  targetUser,
  auth,
  host,
  logger,
  reject,
  resolve
}) {
  if (typeInterface && interfaces[typeInterface]) {
    const client = interfaces[typeInterface]
    if (command && allCommands[command]) {
      await allCommands[command]({ client, file, user, targetUser, auth, host, logger, reject, resolve })
    } else {
      throw new Error(`We don't recognize the command provided: ${command}`)
    }
  } else {
    throw new Error(`We don't recognize the interface provided: ${typeInterface}`)
  }
}
