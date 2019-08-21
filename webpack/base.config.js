const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    renderer: path.resolve(__dirname, '../src/index.tsx')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.ts', '.js']
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.(j|t)sx?$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }, {
      test: /\.(j|t)sx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          babelrc: true,
          cacheDirectory: true,
          extends: path.resolve(__dirname, '../.babelrc')
        }
      }
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html')
    })
  ]
}