export class Cache {
  static cName = 'everything'

  constructor() {}

  async exists() {
    const hasCache = caches.has(Cache.cName)
    return hasCache
  }

  // will create if not exists
  async open(cName) {
    const cache = caches.open(cName)
    return cache
  }
}
