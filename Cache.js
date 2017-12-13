'use strict'

const path = require('path')
const mkdirp = require('mkdirp')
const level = require('level')

let caches = {}

class Cache {
  static async load (directory, dbAddress) {
    const dbPath = path.join(dbAddress.root, dbAddress.path)
    const dataPath = path.join(directory, dbPath)
    let cache = caches[dataPath]
    if (!cache) {
      cache = new Cache(dataPath, dbAddress.toString())
      caches[dataPath] = cache
      await cache.load()
    }
    return cache
  }

  static async close () {
    return Promise.all(Object.values(caches), cache => cache.close())
      .then(() => caches = {})
  }

  constructor (directory, id) {
    this.path = directory || './orbitdb'
    this.id = id
    this._store = null
    this._cache = {}
  }

  async close () {
    if (this._store) 
      await this._store.close()

    this._store = null
  }

  async get(key) {
    if (!this._store)
      await this.load()

    return new Promise((resolve, reject) => {
      this._store.get(key, (err, value) => {
        if (err) {
          // Ignore error if key was not found
          if (err.toString().indexOf('NotFoundError: Key not found in database') === -1)
            return reject(err)
        }
        resolve(value ? JSON.parse(value) : null)
      })
    })
  }

  // Set value in the cache and return the new value
  async set(key, value) {
    if (!this._store)
      await this.load()

    return this._store.put(key, JSON.stringify(value))
  }

  // Remove a value and key from the cache
  async del (key) {
    if (!this._store)
      await this.load()

    return new Promise((resolve, reject) => {
      this._store.del(key, (err, value) => {
        if (err) {
          // Ignore error if key was not found
          if (err.toString().indexOf('NotFoundError: Key not found in database') === -1)
            return reject(err)
        }
        resolve()
      })
    })
  }

  // Load cache from a persisted file
  async load() {
    return new Promise((resolve, reject) => {
      // Check if we have mkdirp
      if (mkdirp && mkdirp.sync) mkdirp.sync(this.path)
      level(this.path, (err, db) => {
        this._store = db
        resolve()
      })
     })
  }
}

module.exports = Cache
