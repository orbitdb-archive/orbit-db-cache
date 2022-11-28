import path from 'path'
import webpack from 'webpack'
import { fileURLToPath } from 'url'

export default (env, argv) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  return {
    mode: 'production',
    entry: './src/Cache.js',
    output: {
      libraryTarget: 'var',
      library: 'Cache',
      filename: '../dist/orbit-db-cache.min.js'
    },
    target: 'web',
    devtool: 'source-map',
    externals: {
      fs: '{}',
      mkdirp: '{}'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      })
    ],
    resolve: {
      modules: [
        'node_modules',
        path.resolve(__dirname, '../node_modules')
      ],
      alias: {
        leveldown: 'level-js'
      }
    },
    resolveLoader: {
      modules: [
        'node_modules',
        path.resolve(__dirname, '../node_modules')
      ],
      extensions: ['.js', '.json'],
      mainFields: ['loader', 'main']
    }
  }
}
