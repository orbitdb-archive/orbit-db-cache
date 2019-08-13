# orbit-db-cache

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/orbitdb/Lobby) [![npm version](https://badge.fury.io/js/orbit-db-cache.svg)](https://www.npmjs.com/package/orbit-db-cache) [![node](https://img.shields.io/node/v/orbit-db-cache.svg)](https://www.npmjs.com/package/orbit-db-cache)

> Local cache for orbit-db

Isomorphic cache used by `orbit-db`, implemented using `level.js` (indexedDB) for the browser and `leveldown` (leveldb) for node.

This project is used in: [orbit-db](https://github.com/orbitdb/orbit-db).

## Install

This project uses [npm](https://npmjs.com) and [nodejs](https://nodejs.org)

```sh
npm install --save orbit-db-cache
```

## API

#### Public methods

##### `get`

Get an item from the cache store

##### `set`

Set a value for a given key on the cache store

##### `del`

Remove a given key-value from the cache store

## Contributing

If you think this could be better, please [open an issue](https://github.com/orbitdb/orbit-db-cache/issues/new)!

Please note that all interactions in @orbitdb fall under our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE) © 2017-2018 Protocol Labs Inc., Haja Networks Oy
