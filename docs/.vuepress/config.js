module.exports = {
  title: 'fluent-vue',
  themeConfig: {
    repo: 'demivan/fluent-vue',
    docsDir: 'docs',
    docsBranch: 'develop',
    editLinks: true,
    smoothScroll: true,
    displayAllHeaders: true,
    sidebar: [
      'introduction',
      'instalation',
      'api',
      {
        title: 'Integrations',
        children: ['/integrations/webpack', '/integrations/vite'],
        collapsable: false,
      },
    ],
  },
  chainWebpack: (config) => {
    config.module
      .rule('fluent-vue')
      .resourceQuery(/blockType=i18n/)
      .use('fluent-vue')
      .loader('fluent-vue-loader')
  },
}
