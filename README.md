# orbit-db-cache


> Local cache for orbit-db

Isomorphic cache used by `orbit-db`, implemented using `level.js` (indexedDB) for the browser and `leveldown` (leveldb) for node.

## Install

This project uses [npm](https://npmjs.com) and [nodejs](https://nodejs.org)

```sh
npm install --save orbit-db-cache
```

## API

### Public methods

#### `open`

Open cache store and make it available to be used (indexedDB or leveldb)

#### `close`

Close cache store and the underlying indexedDB / leveldb instance

#### `destroy`

Completely remove an existing store and deletes the locally persisted cache

#### `get`

Get an item from the cache store

#### `set`

Set a value for a given key on the cache store

#### `del`

Remove a given key-value from the cache store

## Contributing

If you think this could be better, please [open an issue](https://github.com/orbitdb/repo-template/issues/new)!

Please note that all interactions in @orbitdb fall under our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE) © 2017-2018 Protocol Labs Inc., Haja Networks Oy
