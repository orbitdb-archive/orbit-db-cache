import Logger from 'logplease'
const logger = Logger.create('cache', { color: Logger.Colors.Magenta })
Logger.setLogLevel('ERROR')

export default class Cache {
  constructor (store) {
    this._store = store
  }

  get status () { return this._store.status }

  async close () {
    if (!this._store) throw new Error('No cache store found to close')

    if (this.status === 'open') {
      await this._store.close()
    }
  }

  async open () {
    if (!this._store) throw new Error('No cache store found to open')

    if (this.status !== 'open') {
      await this._store.open()
    }
  }

  async get (key) {
    try {
      return JSON.parse(await this._store.get(key))
    } catch (e) {
      if (e.code === 'LEVEL_NOT_FOUND' || (e.cause !== undefined && e.cause.code === 'LEVEL_NOT_FOUND')) return null
      throw e
    }
  }

  // Set value in the cache and return the new value
  async set (key, value) {
    await this._store.put(key, JSON.stringify(value))
    logger.debug(`cache: Set ${key} to ${JSON.stringify(value)}`)
  }

  load () {} // noop
  destroy () { } // noop

  // Remove a value and key from the cache
  async del (key) {
    await this._store.del(key)
  }
}
