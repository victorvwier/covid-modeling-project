

const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.common.js')

module.exports = merge(webpackBaseConfig, {
  mode: 'development',
  devtool: 'source-map',
  // devServer: {
  //   host: '0.0.0.0',
  //   publicPath: '/dist/',
  // },
})