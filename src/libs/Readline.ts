import readline from 'readline'
import { Readable, Writable } from 'stream'

export default function Readline(
  inputStream: Readable = process.stdin,
  outputStream: Writable = process.stdout
) {
  return {
    rl: readline.createInterface({ input: inputStream, output: outputStream }),

    async ask(question: string, close: boolean = true): Promise<string> {
      return await new Promise((resolve, reject) => {
        this.rl.question(question, (answer: string) => {
          resolve(answer)

          if (close) this.close()
        })
      })
    },

    close(): void {
      this.rl.close()
    },
  }
}
