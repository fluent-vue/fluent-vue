// CommonJS on purpose: it loads the ESM-only unplugin-fluent-vue through require()
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { SFCFluentPlugin } = require('unplugin-fluent-vue/webpack')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: './src/main.js',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    SFCFluentPlugin(),
  ],
}
