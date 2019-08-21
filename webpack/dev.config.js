const merge = require('webpack-merge');
const baseConfig = require('./base.config');

module.exports = merge.smart(baseConfig, {
  target: 'electron-renderer',
  mode: 'development',
});