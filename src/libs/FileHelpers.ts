import { Response } from 'express'
import fs from 'fs'
import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'

const markdown = MarkdownIt({
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(lang, str, true).value
        }</code></pre>`
      } catch (__) {}
    }

    return '' // use external default escaping
  },
})

const readFile = fs.promises.readFile

export default {
  getFileName(fileName: string, extraText: number | string = Date.now()) {
    const lastPeriod = fileName.lastIndexOf('.')
    const extension = fileName.substring(lastPeriod)
    return `${fileName.substring(0, lastPeriod)}_${extraText}${extension}`
  },

  expressjs: {
    async convertReadmeToHtml(res: Response) {
      const mdRaw: string = await readFile('README.md', 'utf8')
      const mdHtml = markdown.render(mdRaw, {})
      return res.send(this.createHtmlPage(mdHtml))
    },

    createHtmlPage(bodyHtml: string) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>txr - Transfer Files to Friends</title>

            <style>
              body {
                font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
              }

              a {
                color: inherit;
              }

              pre.hljs {
                border-radius: 5px;
                border: 1px solid #a0a0a0;
                background: #f5f5f5;
                overflow-x: scroll;
                padding: 5px;
              }

              .container {
                max-width: 700px;
                margin-right: auto;
                margin-left: auto;
              }

              .notice {
                border-radius: 5px;
                border: 1px solid #a0a0a0;
                background: #28a745;
                color: white;
                padding: 15px;
                margin: 25px 0px;
              }
            </style>
          </head>

          <body>
            <div class="container">
              <div class="notice">
                You navigated to a txr server to transfer files easily to and
                from machines/servers. Learn more below or by visiting
                <a href="https://github.com/whatl3y/txr">https://github.com/whatl3y/txr</a>
              </div>
              ${bodyHtml}
            </div>
          </body>
        </html>
      `
    },
  },
}
