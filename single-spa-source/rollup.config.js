import serve from 'rollup-plugin-serve'

export default {
  input: './src/single-spa.js',
  output: {
    file: './lib/umd/single-spa.js',
    format: 'umd',
    name: 'singleSpa', // 导出的全局对象名
    sourcemap: true,
  },
  plugins: [
    serve({
      port: 40000,
      contentBase: [''],
      openPage: './index.html',
    }),
  ],
}
