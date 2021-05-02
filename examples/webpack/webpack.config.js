const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        // https://github.com/projectfluent/fluent.js/issues/517
        test: /\.js/,
        include: /@fluent[\\/](bundle|langneg|syntax|sequence)[\\/]/,
        type: 'javascript/esm',
      },
      {
        resourceQuery: /blockType=fluent/,
        loader: 'fluent-vue-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
}
