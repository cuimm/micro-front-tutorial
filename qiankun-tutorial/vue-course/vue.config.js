const path = require('path')

module.exports = {
  // publicPath: '//test.weibo.com:20000',
  configureWebpack: {
    output: {
      library: 'course',
      libraryTarget: 'umd',
    },
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    disableHostCheck: true,
    port: 20000,
    headers: {
      'Access-Control-Allow-Origin': '*' // 支持跨域
    }
  },
}
