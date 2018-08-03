import FileHelpers from '../libs/FileHelpers'
import Helpers from '../libs/Helpers'

export default function Routes({ app }) {
  return {
    async ['/clients'](req, res) {
      const clientInfo = Helpers.paginateArray(Object.keys(await app.get('names')))
      res.json(clientInfo)
    },

    ['*'](req, res) {
      FileHelpers.expressjs.convertReadmeToHtml(res)
    }
  }
}
