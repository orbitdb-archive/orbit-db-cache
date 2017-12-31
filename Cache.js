'use strict'

const path = require('path')

let caches = {}

class Cache {
  constructor (storage, directory) {
    this.path = directory || './orbitdb'
    this._storage = storage
    this._store = null
  }

  // Setup storage backend
  async open() {
    if (this.store)
      return Promise.resolve()

    return new Promise((resolve, reject) => {
      const store = this._storage(this.path)
      store.open((err) => {
        if (err) {
          return reject(err)
        }
        this._store = store
        resolve()
      })
    })
  }

  async close () {
    if (!this._store)
      return Promise.resolve()

    return new Promise(resolve => {
      this._store.close((err) => {
        if (err) {
          return reject(err)
        }
        this._store = null
        delete caches[this.path]
        resolve()
      })
    })
  }

  async destroy () {
    return new Promise((resolve, reject) => {
      this._storage.destroy(this.path, (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  async get(key) {
    if (!this._store)
      await this.open()

    return new Promise((resolve, reject) => {
      this._store.get(key, (err, value) => {
        if (err) {
          // Ignore error if key was not found
          if (err.toString().indexOf('NotFoundError: Key not found in database') === -1
            && err.toString().indexOf('NotFound') === -1)
            return reject(err)
        }
        resolve(value ? JSON.parse(value) : null)
      })
    })
  }

  // Set value in the cache and return the new value
  async set(key, value) {
    if (!this._store)
      await this.open()

    return new Promise((resolve, reject) => {
      this._store.put(key, JSON.stringify(value), (err) => {
        if (err) {
          // Ignore error if key was not found
          if (err.toString().indexOf('NotFoundError: Key not found in database') === -1
            && err.toString().indexOf('NotFound') === -1)
            return reject(err)
        }
        resolve()
      })
    })
  }

  // Remove a value and key from the cache
  async del (key) {
    if (!this._store)
      await this.open()

    return new Promise((resolve, reject) => {
      this._store.del(key, (err) => {
        if (err) {
          // Ignore error if key was not found
          if (err.toString().indexOf('NotFoundError: Key not found in database') === -1
            && err.toString().indexOf('NotFound') === -1)
            return reject(err)
        }
        resolve()
      })
    })
  }
}

module.exports = (storage, mkdir) => {
  return {
    load: async (directory, dbAddress) => {
      const dbPath = path.join(dbAddress.root, dbAddress.path)
      const dataPath = path.join(directory, dbPath)
      let cache = caches[dataPath]
      if (!cache) {
        if (mkdir && mkdir.sync) 
          mkdir.sync(dataPath)
        cache = new Cache(storage, dataPath)
        await cache.open()
        caches[dataPath] = cache
      }
      return cache
    },
    close: async () => {
      await Promise.all(Object.values(caches), cache => cache.close())
      caches = {}
    },
  }
}
