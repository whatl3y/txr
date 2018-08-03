export default {
  filepath: process.env.TXR_PATH || process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],

  server: {
    port:     process.env.PORT || 8000,
    web_conc: process.env.WEB_CONCURRENCY || 1,
    host:     process.env.TXR_HOST || "https://txr.euphoritech.com"
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },

  logger: {
    options: {
      name:   process.env.APP_NAME || "txr",
      level:  process.env.LOGGING_LEVEL || "info",
      stream: process.stdout
    }
  }
}
