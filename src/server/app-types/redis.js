export default function redisApp(redis) {
  return {
    async set(namespace, key, value) {
      let currentNamespaceData = JSON.parse((await redis.get(`txr.${namespace}`)) || '{}')
      currentNamespaceData[key] = value
      await redis.set(`txr.${namespace}`, JSON.stringify(currentNamespaceData))
      return value
    },

    async get(namespace, key=null) {
      const currentNamespaceData = JSON.parse((await redis.get(`txr.${namespace}`)) || '{}')
      return (key) ? currentNamespaceData[key] : currentNamespaceData
    },

    async del(namespace, key) {
      let currentNamespaceData = JSON.parse((await redis.get(`txr.${namespace}`)) || '{}')
      delete(currentNamespaceData[key])
      await redis.set(`txr.${namespace}`, JSON.stringify(currentNamespaceData))
    }
  }
}
