import bunyan from 'bunyan'

interface ITxrConfig {
  filepath: string
  server: ITxrConfigServer
  redis: ITxrConfigRedis
  logger: ITxrConfigLogger
}

interface ITxrConfigServer {
  port: number | string
  web_conc: number | string
  host: string
}

interface ITxrConfigRedis {
  url: string
}

interface ITxrConfigLogger {
  options: bunyan.LoggerOptions
}

const opts: ITxrConfig = {
  filepath:
    process.env.TXR_PATH ||
    process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'] ||
    '.',

  server: {
    port: process.env.PORT || 8000,
    web_conc: process.env.WEB_CONCURRENCY || 1,
    host: process.env.TXR_HOST || 'https://txr.euphoritech.com',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  logger: {
    options: {
      name: process.env.APP_NAME || 'txr',
      level: 'info', // process.env.LOGGING_LEVEL
      stream: process.stdout,
    },
  },
}

export default opts
