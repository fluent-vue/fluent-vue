module.exports = {
  title: 'fluent-vue documentation',
  chainWebpack: (config) => {
    config.module
      .rule('fluent-vue')
      .resourceQuery(/blockType=i18n/)
      .use('fluent-vue')
      .loader('fluent-vue-loader')
  },
}
