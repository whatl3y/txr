
export default {
  paginateArray(ary, perPage=9e7, pageNumber=1) {
    const start = perPage * (pageNumber-1)

    if (ary instanceof Array) {
      const size = ary.length
      return {
        data: ary.slice(start,start+perPage),
        number_of_pages: Math.ceil(size/perPage),
        current_page: pageNumber,
        data_length: size
      }
    } else if (typeof ary === "object" && ary != null) {
      const obj = ary
      const keys = Object.keys(obj).sort()
      const size = keys.length
      const filteredKeys = keys.slice(start,start+perPage)
      let filteredObj = {}
      for (var _i=0; _i<filteredKeys.length; _i++) {
        filteredObj[filteredKeys[_i]] = obj[filteredKeys[_i]];
      }

      return {
        data: filteredObj,
        number_of_pages: Math.ceil(size/perPage),
        current_page: pageNumber,
        data_length: size
      }
    }

    return ary
  }
}
