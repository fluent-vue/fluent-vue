module.exports = {
  configureWebpack: (config) => {
    config.module.rules.push({
      resourceQuery: /blockType=i18n/,
      loader: 'fluent-vue-loader',
    })
  },
}
