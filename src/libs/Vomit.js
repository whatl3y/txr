import colors from 'colors'

const NOOP = ()=>{}

export default {
  twoLinesDifferentColors(str1, str2, color1='blue', color2='green') {
    this.wrapInNewlines(() => {
      if (str1.length > 0) console.log(str1[color1])
      if (str2.length > 0) console.log(str2[color2])
    })
  },

  singleLine(str, color='blue', numWrappedRows=1) {
    this.wrapInNewlines(() => console.log(str[color]), numWrappedRows)
  },

  success(string) {
    this.wrapInNewlines(() => console.log(string.green))
  },

  error(string) {
    this.wrapInNewlines(() => console.log(string.red))
  },

  progress(progressString) {
    process.stdout.write(progressString)
  },

  wrapInNewlines(functionToWriteMoreOutput=NOOP, howMany=1) {
    const newlineString = (howMany-1 > 0) ? new Array(howMany-1).fill('\n').join('') : ''
    // if (howMany > 0) console.log(newlineString)
    functionToWriteMoreOutput()
    // if (howMany > 0) console.log(newlineString)
  }
}
