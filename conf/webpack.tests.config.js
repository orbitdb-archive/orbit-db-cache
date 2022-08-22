'use strict'

const glob = require('glob')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  // TODO: put all tests in a .js file that webpack can use as entry point
  entry: glob.sync('./test/*.spec.js'),
  output: {
    filename: '../test/browser/bundle.js'
  },
  target: 'web',
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /mongo|redis/,
      contextRegExp: /mongo|redis/
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ],
  externals: {
    fs: '{}',
    fatfs: '{}',
    runtimejs: '{}',
    net: '{}',
    tls: '{}',
    child_process: {},
    dns: '{}'
    // path: '{}',
    // "node-gyp-build": '{}'
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../node_modules')
    ],
    fallback: {
      assert: require.resolve('assert'),
      path: require.resolve('path-browserify'),
      util: require.resolve('util'),
      os: false
    }
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../node_modules')
    ],
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { modules: false }]
            ],
            plugins: ['@babel/syntax-object-rest-spread', '@babel/transform-runtime', '@babel/plugin-transform-modules-commonjs']
          }
        }
      }
    ]
  }
}
