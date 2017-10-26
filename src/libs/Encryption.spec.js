import assert from 'assert'
import Encryption from './Encryption.js'

describe('Encryption', function() {
  describe('#stringToHash()', function() {
    it(`should hash string without error`, () => {
      const hash = Encryption.stringToHash('test123')
      assert.equal(typeof hash, 'string')
      assert.equal(true, hash.length > 5)
    })
  })
})
