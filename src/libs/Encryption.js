import crypto from 'crypto'

export default {
  stringToHash(string) {
    const md5Sum = crypto.createHash("md5")
    md5Sum.update(string)
    return md5Sum.digest("hex")
  }
}
