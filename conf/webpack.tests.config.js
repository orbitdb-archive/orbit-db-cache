import glob from 'glob'
import webpack from 'webpack'

export default (env, argv) => {
  return {
    // TODO: put all tests in a .js file that webpack can use as entry point
    entry: glob.sync('./test/*.spec.js'),
    output: {
      filename: '../test/browser/bundle.js'
    },
    target: 'web',
    mode: 'production',
    devtool: 'source-map',
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      })
    ],
    experiments: {
      topLevelAwait: true
    },
    resolve: {
      modules: [
        'node_modules'
      ],
      fallback: {
        path: false,
        os: false,
        fs: false
      }
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  }
}
