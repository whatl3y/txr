import IORedis from 'ioredis'
import { ITxrApp } from './index'
import memory from './memory'

export default function redisApp(redis: IORedis.Redis): ITxrApp {
  return {
    async set(namespace: string, key: string, value: string) {
      let currentNamespaceData = JSON.parse(
        (await redis.get(`txr.${namespace}`)) || '{}'
      )
      currentNamespaceData[key] = value
      await redis.set(`txr.${namespace}`, JSON.stringify(currentNamespaceData))
      return value
    },

    async get(namespace: string, key: null | string = null) {
      const currentNamespaceData = JSON.parse(
        (await redis.get(`txr.${namespace}`)) || '{}'
      )
      return key ? currentNamespaceData[key] : currentNamespaceData
    },

    async del(namespace: string, key: string) {
      let currentNamespaceData = JSON.parse(
        (await redis.get(`txr.${namespace}`)) || '{}'
      )
      delete currentNamespaceData[key]
      await redis.set(`txr.${namespace}`, JSON.stringify(currentNamespaceData))
    },

    async flush(namespaces: string[] = Object.keys(memory().app)) {
      return await Promise.all(
        namespaces.map(async (namespace) => {
          await redis.del(`txr.${namespace}`)
        })
      )
    },
  }
}
