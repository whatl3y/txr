import createClient from '../client'

export default async function txrLibraryClient(argv) {
  return await new Promise(async (resolve, reject) => {
    const typeInterface = 'library'
    const command       = argv.c || argv.command
    const file          = argv.f || argv.file || argv.d || argv.dir
    const user          = argv.u || argv.username || argv.user
    const targetUser    = argv.t || argv.target_user || argv.targetUser
    const auth          = argv.a || argv.auth
    const host          = argv.h || argv.host
    const logger        = argv.l || argv.logger

    // TODO: should we do more validation here for inputs?

    try {
      await createClient({
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
      })
    } catch(err) {
      reject(err)
    }
  })
}
