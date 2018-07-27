import readline from 'readline'

export default function Readline(inputStream=process.stdin, outputStream=process.stdout) {
  return {
    rl: readline.createInterface({ input: inputStream, output: outputStream }),

    ask(question, close=true) {
      return new Promise((resolve, reject) => {
        this.rl.question(question, answer => {
          resolve(answer)

          if (close)
            this.close()
        })
      })
    },

    close() {
      this.rl.close()
    }
  }
}
