const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const colors = require('colors');
const { spawn } = require('child_process');
const baseConfig = require('./base.config');

module.exports = merge.smartStrategy({
  'module.rules.use': 'prepend'
})(baseConfig, {
  target: 'electron-renderer',
  entry: {
    renderer: [
      '@babel/polyfill',
      'react-hot-loader/patch',
      path.resolve(__dirname, '../src/index.tsx')
    ]
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.s?css$/,
      use: ['style-loader']
    }]
  },
  devServer: {
    port: process.env.DEV_SERVER_PORT,
    compress: true,
    noInfo: true,
    stats: 'errors-only',
    inline: true,
    hot: true,
    historyApiFallback: true,
    after() {
      /* eslint-disable no-console */
      console.log(colors.green('\n----------------------------------------------\n'));
      console.log(colors.red.underline('Starting application in DEV mode....'));
      console.log(colors.green('\n----------------------------------------------\n'));

      spawn('npm', ['run', 'start'], {
        shell: true,
        env: process.env,
        stdio: 'inherit'
      })
        .on('close', code => process.exit(code))
        .on('error', spawnError => console.error(spawnError));
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});
