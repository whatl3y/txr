import { Request, Response } from 'express'
import FileHelpers from '../libs/FileHelpers'
import Helpers from '../libs/Helpers'

interface IRoutesOptions {
  app: any
}

export default function Routes({ app }: IRoutesOptions) {
  return {
    async ['/clients'](req: Request, res: Response) {
      const clientInfo = Helpers.paginateArray(
        Object.keys(await app.get('names'))
      )
      res.json(clientInfo)
    },

    ['*'](req: Request, res: Response) {
      FileHelpers.expressjs.convertReadmeToHtml(res)
    },
  }
}
