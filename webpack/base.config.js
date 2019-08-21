const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.ts', '.js', '.json']
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
    }, {
      test: /\.s?css$/,
      use: [
        {
          loader: 'css-loader',
          options: {
            sourceMap: false
          }
        }, {
          loader: 'sass-loader',
          options: {
            includePaths: ['node_modules'],
          },
        }, {
          loader: 'sass-resources-loader',
          options: {
            resources: [
              path.resolve(__dirname, '../src/styles/settings.scss'),
            ],
          },
        }
      ]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html')
    })
  ]
};
