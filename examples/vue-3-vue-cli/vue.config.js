module.exports = {
  configureWebpack: (config) => {
    config.module.rules.push({
      resourceQuery: /blockType=fluent/,
      loader: 'fluent-vue-loader'
    })
  }
}
