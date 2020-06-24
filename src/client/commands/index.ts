import chat from './chat'
import listen from './listen'
import send from './send'

export default {
  chat,
  listen,
  send,
}

export interface ICommandOptions {
  client: any
  file: string
  user: string
  targetUser?: string
  auth?: boolean
  host?: string
  logger?: any
  callback?: (foo?: any) => void
  reject?: (err: string | Error) => void
  resolve?: (foo?: any) => void
}
