import assert from 'assert'
import Helpers from './Helpers'

describe('Helpers', () => {
  describe(`#paginateArray()`, () => {
    const paginateArray = Helpers.paginateArray
    
    const ary = [1,2,3,4,5,6,7,8,9,10,11,12]
    const perPage = 5
    const obj1 = paginateArray(ary, perPage, 1)
    const obj2 = paginateArray(ary, perPage, 2)
    const obj3 = paginateArray(ary, perPage, 3)
    const obj4 = paginateArray(ary, 1e4, 1)

    it(`should return valid information for first page`, function() {
      assert.equal(5, obj1.data.length)
      assert.equal(3, obj1.number_of_pages)
      assert.equal(1, obj1.current_page)
      assert.equal(12, obj1.data_length)
    })

    it(`should return valid information for second page`, function() {
      assert.equal(5, obj2.data.length)
      assert.equal(3, obj2.number_of_pages)
      assert.equal(2, obj2.current_page)
      assert.equal(12, obj2.data_length)
    })

    it(`should return valid information for third page`, function() {
      assert.equal(2, obj3.data.length)
      assert.equal(3, obj3.number_of_pages)
      assert.equal(3, obj3.current_page)
      assert.equal(12, obj3.data_length)
    })

    it(`should return all information for more perPage than entries`, function() {
      assert.equal(12, obj4.data.length)
      assert.equal(1, obj4.number_of_pages)
      assert.equal(1, obj4.current_page)
      assert.equal(12, obj4.data_length)
    })
  })
})
