'use strict'

const pull = require('pull-stream')
const BlobStore = require('fs-pull-blob-store')
const Lock = require('lock')

class Cache {
  constructor(path, dbname = 'data') {
    this.path = path || './orbitdb'
    this.filename = dbname + '.orbitdb'
    this._store = new BlobStore(this.path)
    this._cache = {}
    this._lock = new Lock()
  }

  get(key) {
    return this._cache[key]
  }

  // Set value in the cache and return the new value
  set(key, value) {
    return new Promise((resolve, reject) => {
      if (this._cache[key] === value)
        return resolve(value)

      this._cache[key] = value
      this._lock(this.filename, (release) => {
        pull(
          pull.values([this._cache]),
          pull.map((v) => JSON.stringify(v, null, 2)),
          this._store.write(this.filename, release((err) => {
            if (err) {
              return reject(err)
            }

            resolve(value)
          }))
        )
      })
    })
  }

  // Load cache from a persisted file
  load() {
    this._cache = {}
    return new Promise((resolve, reject) => {
      this._store.exists(this.filename, (err, exists) => {
        if (err || !exists) {
          return resolve()
        }

        this._lock(this.filename, (release) => {
          pull(
            this._store.read(this.filename),
            pull.collect(release((err, res) => {
              if (err) {
                return reject(err)
              }

              try {
                this._cache = JSON.parse(Buffer.concat(res).toString() || '{}')
              } catch(e) {
                return reject(e)
              }

              resolve()
            }))
          )
        })
      })
    })
  }

  reset() {
    this._cache = {}
    this._store = null
  }
}

module.exports = Cache
