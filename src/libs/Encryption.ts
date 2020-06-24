import crypto from 'crypto'

export default {
  stringToHash(str: string): string {
    const md5Sum = crypto.createHash('md5')
    md5Sum.update(str)
    return md5Sum.digest('hex')
  },
}
