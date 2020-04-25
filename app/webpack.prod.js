const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpackBaseConfig = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin(),
      new OptimizeCSSAssetsPlugin()
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
})