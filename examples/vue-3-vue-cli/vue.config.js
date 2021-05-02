module.exports = {
  configureWebpack: (config) => {
    config.module.rules.push({
      include: /@fluent[\\/](bundle|langneg|syntax|sequence)[\\/]/,
      test: /[.]js$/,
      type: 'javascript/esm',
    })

    config.module.rules.push({
      resourceQuery: /blockType=fluent/,
      loader: 'fluent-vue-loader',
    })
  },
}
