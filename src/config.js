export default {
  filepath: process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],

  server: {
    port: process.env.PORT || 8000,
    web_concurrency: process.env.WEB_CONCURRENCY || 1,
    host: process.env.HOSTNAME || "http://localhost:8000"
  },

  logger: {
    options: {
      name: process.env.APP_NAME || "file-handoff",
      level: process.env.LOGGING_LEVEL || "info",
      stream: process.stdout
      /*streams: [
        {
          level: process.env.LOGGING_LEVEL || "info",
          path: path.join(__dirname, "logs", "file-handoff.log")
        }
      ]*/
    }
  }
}
