import type { DefaultThemeOptions } from 'vuepress-vite'

import { defineUserConfig } from 'vuepress-vite'
import fluentPlugin from 'rollup-plugin-fluent-vue'

import { BUNDLED_LANGUAGES } from 'shiki'
import VueGrammar from 'shiki/languages/vue.tmLanguage.json'
import FluentGrammar from './fluent.tmLanguage.json'

const shikiLanguages = BUNDLED_LANGUAGES
  .filter(lang => lang.id !== 'vue')

Object.assign(VueGrammar.repository, FluentGrammar.repository)

// Add fluent support to shiki Vue lang definition
VueGrammar.patterns.unshift(
  {
    "begin": "(<)(fluent)",
    "beginCaptures": {
      "1": {
        "name": "punctuation.definition.tag.begin.html"
      },
      "2": {
        "name": "entity.name.tag.style.html"
      }
    },
    "end": "(</)(fluent)(>)",
    "endCaptures": {
      "1": {
        "name": "punctuation.definition.tag.begin.html"
      },
      "2": {
        "name": "entity.name.tag.style.html"
      },
      "3": {
        "name": "punctuation.definition.tag.end.html"
      }
    },
    "patterns": [
      {
          "begin": "(>)",
          "end": "(?=</fluent>)",
          "contentName": "source.ftl",
          "patterns": [{
            "include": "#comment"
          },{
            "include": "#message"
          }]
      }
    ]
  }
)

export default defineUserConfig<DefaultThemeOptions>({
  title: 'fluent-vue',
  description: 'fluent-vue is an internationalization plugin for Vue.js that works both with Vue 2 and Vue 3. Is it a Vue.js integration for Mozilla\'s Project Fluent.',
  head: [
    ['meta', { name: 'keywords', content: 'vue, i18n, vue i18n, vue.js, internationalization, localization, vue plugin, fluent, project fluent' }]
  ],
  themeConfig: {
    repo: 'demivan/fluent-vue',
    logo: '/assets/logo.svg',
    docsDir: 'docs',
    docsBranch: 'develop',
    editLinks: true,
    smoothScroll: true,
    displayAllHeaders: true,
    sidebarDepth: 0,
    sidebar: [
      '/introduction.html',
      '/installation.html',
      {
        text: 'Api',
        children: ['/api/instance-methods.html', '/api/v-t-directive.html', '/api/i18n-component.html'],
        collapsable: false,
      },
      '/vue-i18n-comparison.html',
      {
        text: 'HOWTO',
        children: ['/howto/change-locale.html', '/howto/date-time.html', '/howto/access-outside-of-component.html'],
        collapsable: false,
      },
      {
        text: 'Tooling and integrations',
        link: '/integrations',
        children: ['/integrations/webpack.html', '/integrations/rollup.html', '/integrations/vite.html'],
        collapsable: false,
      },
    ]
  },
  plugins: [
    [
      '@vuepress/shiki', 
      {
        theme: 'solarized-dark',
        langs: [
          ...shikiLanguages, {
            id: 'vue',
            scopeName: 'source.vue',
            grammar: VueGrammar
          }, {
            id: 'ftl',
            scopeName: 'source.ftl',
            grammar: FluentGrammar
          }
        ]
      }
    ],
    '@vuepress/plugin-search',
    [
      '@vuepress/plugin-google-analytics',
      {
        id: 'G-XBF065RFBE',
      },
    ],
    [
      require.resolve('./sitemapPlugin.ts'),
      {
        hostname: 'https://fluent-vue.demivan.me',
        exclude: ['/404.html']
      }
    ]
  ],
  bundlerConfig: {
    viteOptions: {
      plugins: [
        fluentPlugin()
      ]
    }
  }
})
