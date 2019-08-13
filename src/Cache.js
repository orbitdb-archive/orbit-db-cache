'use strict'

const Logger = require('logplease')
const logger = Logger.create('cache', { color: Logger.Colors.Magenta })
Logger.setLogLevel('ERROR')

class Cache {
  constructor (store) {
    this._store = store
  }

  async close () { await this._store.close() }

  async get (key) {
    return new Promise((resolve, reject) => {
      this._store.get(key, (err, value) => {
        if (err) {
          // Ignore error if key was not found
          if (err.toString().indexOf('NotFoundError: Key not found in database') === -1 &&
            err.toString().indexOf('NotFound') === -1) {
            return reject(err)
          }
        }
        resolve(value ? JSON.parse(value) : null)
      })
    })
  }

  // Set value in the cache and return the new value
  set (key, value) {
    return new Promise((resolve, reject) => {
      this._store.put(key, JSON.stringify(value), (err) => {
        if (err) {
          // Ignore error if key was not found
          if (err.toString().indexOf('NotFoundError: Key not found in database') === -1 &&
            err.toString().indexOf('NotFound') === -1) {
            return reject(err)
          }
        }
        logger.debug(`cache: Set ${key} to ${value}`)
        resolve()
      })
    })
  }

  load () {} // noop
  destroy () { } // noop

  // Remove a value and key from the cache
  async del (key) {
    return new Promise((resolve, reject) => {
      this._store.del(key, (err) => {
        if (err) {
          // Ignore error if key was not found
          if (err.toString().indexOf('NotFoundError: Key not found in database') === -1 &&
            err.toString().indexOf('NotFound') === -1) {
            return reject(err)
          }
        }
        resolve()
      })
    })
  }
}

module.exports = Cache
