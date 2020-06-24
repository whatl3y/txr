import 'colors'

const NOOP = () => {}

export default {
  success(string: string) {
    this.wrapInNewlines(() => console.log(string.green))
  },

  error(string: string) {
    this.wrapInNewlines(() => console.log(string.red))
  },

  progress(progressString: string) {
    process.stdout.write(progressString)
  },

  chatMessage(string: string) {
    this.wrapInNewlines(() => console.log(string.cyan))
  },

  wrapInNewlines(functionToWriteMoreOutput: any = NOOP, howMany: number = 0) {
    const newlineString =
      howMany - 1 > 0 ? new Array(howMany - 1).fill('\n').join('') : ''
    if (howMany > 0) console.log(newlineString)
    functionToWriteMoreOutput()
    if (howMany > 0) console.log(newlineString)
  },
}
