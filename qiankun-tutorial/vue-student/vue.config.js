const path = require('path')
const packageName = require('./package.json').name;

module.exports = {
  // publicPath: '//test.weibo.com:10000',
  configureWebpack: {
    output: {
      library: 'student',
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${packageName}`
    },
  },
  devServer: {
    disableHostCheck: true,
    contentBase: path.resolve(__dirname, 'dist'),
    port: 10000,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
  },
}
