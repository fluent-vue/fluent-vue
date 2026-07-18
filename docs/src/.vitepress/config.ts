import { defineConfig } from 'vitepress'

import { SFCFluentPlugin } from 'unplugin-fluent-vue/vite'

import { type LanguageRegistration } from 'shiki'
import FluentLanguage from './fluent.tmLanguage.json'
import VueInjection from './vue.injection.json'

const domain = 'https://fluent-vue.demivan.me'

const meta = {
  title: 'fluent-vue - Internationalization plugin for Vue.js',
  description: 'Vue.js integration for Fluent.js - JavaScript implementation of Mozilla\'s Project Fluent',
  image: `${domain}/preview.png`,
}

export default async() => defineConfig({
  title: 'fluent-vue',
  titleTemplate: ':title - fluent-vue',
  description: meta.description,
  head: [
    ['meta', { name: 'keywords', content: 'vue, i18n, vue i18n, vue.js, internationalization, localization, vue plugin, fluent, project fluent' }],
    ['meta', { property: 'og:url', content: domain }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: meta.title }],
    ['meta', { property: 'og:description', content: meta.description }],
    ['meta', { property: 'og:image', content: meta.image }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: meta.title }],
    ['meta', { name: 'twitter:description', content: meta.description }],
    ['meta', { name: 'twitter:image', content: meta.image }],
  ],
  transformHead(ctx) {
    return [
      ['meta', { property: 'og:url', content: `${domain}/${ctx.pageData.relativePath.replace('index.md', '').replace('.md', '')}` }],
      ['link', { rel: 'canonical', href: `${domain}/${ctx.pageData.relativePath.replace('index.md', '').replace('.md', '')}` }]
    ]
  },
  sitemap: {
    hostname: domain,
  },
  cleanUrls: true,

  themeConfig: {
    logo: {
      src: '/assets/logo.svg',
      alt: 'fluent-vue Logo',
    },
    siteTitle: 'fluent-vue',

    algolia: {
      appId: 'KY7MO3VGVQ',
      apiKey: 'e6f42eada0a04e0b9d9fd48b210d64db',
      indexName: 'fluent-vue-demivan',
    },

    nav: [
      {
        text: 'Guide',
        link: '/introduction'
      },
      {
        text: 'Syntax',
        link: '/fluent-syntax'
      },
      {
        text: 'API',
        link: '/api/instance-methods'
      },
      {
        text: 'Comparison with vue-i18n',
        link: '/vue-i18n-comparison'
      }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Fluent syntax', link: '/fluent-syntax' },
          { text: 'Installation', link: '/installation' },
          { text: 'Comparison with vue-i18n', link: '/vue-i18n-comparison' },
        ]
      },
      {
        text: 'API',
        items: [
          { text: '$t and $ta instance methods', link: '/api/instance-methods' },
          { text: 'Composition API', link: '/api/composition-api' },
          { text: 'v-t directive', link: '/api/v-t-directive' },
          { text: 'i18n component', link: '/api/i18n-component' },
        ]
      },
      {
        text: 'How-to',
        items: [
          { text: 'Changing locale', link: '/howto/change-locale' },
          { text: 'Localizing date and time', link: '/howto/date-time' },
          { text: 'Importing .ftl files', link: '/howto/importing-ftl-files' },
          { text: 'Access outside of component', link: '/howto/access-outside-of-component' },
        ]
      },
      {
        text: 'Tooling and integrations',
        items: [
          { text: 'Overview', link: '/integrations/' },
          { text: 'Unplugin', link: '/integrations/unplugin' },
          { text: 'Nuxt', link: '/integrations/nuxt' },
          { text: 'Webpack loader', link: '/integrations/webpack' },
          { text: 'Rollup plugin', link: '/integrations/rollup' },
          { text: 'Vite plugin', link: '/integrations/vite' },
        ]
      }
    ],

    editLink: {
      pattern: 'https://github.com/fluent-vue/docs/edit/main/src/:path',
      text: 'Edit this page on GitHub'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/fluent-vue/fluent-vue' }
    ],

    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2020-present Ivan Demchuk'
    }
  },
  markdown: {
    theme: {
      light: 'catppuccin-latte',
      dark: 'catppuccin-mocha'
    },
    languages: [
      {
        "injectTo": [
          "source.vue"
        ],
        ...VueInjection as unknown as LanguageRegistration
      },
      FluentLanguage as unknown as LanguageRegistration],
  },
  vite: {
    plugins: [
      SFCFluentPlugin()
    ]
  }
})
