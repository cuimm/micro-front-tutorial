const path = require('path')


module.exports = {
  devServer: {
    disableHostCheck: true,
    contentBase: path.resolve(__dirname, 'dist'),
    port: 30000,
  }
}
