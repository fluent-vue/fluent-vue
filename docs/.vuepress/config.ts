import type { DefaultThemeOptions } from 'vuepress'

import { defineUserConfig } from 'vuepress'
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
  description: 'Internationalization plugin for Vue.js. Vue.js integration for Project Fluent.',
  themeConfig: {
    repo: 'demivan/fluent-vue',
    docsDir: 'docs',
    docsBranch: 'develop',
    editLinks: true,
    smoothScroll: true,
    displayAllHeaders: true,
    sidebarDepth: 0,
    sidebar: [
      '/introduction.html',
      '/instalation.html',
      {
        text: 'Api',
        children: ['/api/instance-methods.html', '/api/v-t-directive.html', '/api/i18n-component.html', '/api/vue-i18n-comparison.html'],
        collapsable: false,
      },
      {
        text: 'HOWTO',
        children: ['/howto/date-time.html', '/howto/access-outside-of-component.html'],
        collapsable: false,
      },
      {
        text: 'Integrations',
        children: ['/integrations/webpack.html', '/integrations/vite.html'],
        collapsable: false,
      },
    ]
  },
  plugins: [
    ['@vuepress/shiki', {
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
    }],
    '@vuepress/plugin-search'
  ],
  bundlerConfig: {
    chainWebpack: (config) => {
    config.module
      .rule('fluent-vue')
      .resourceQuery(/blockType=fluent/)
      .use('fluent-vue')
      .loader('fluent-vue-loader')

    config.module
      .rule('fix-fluent')
      .include
        .add((/@fluent[\\/](bundle|langneg|syntax|sequence)[\\/]/))
        .end()
      .test(/[.]js$/)
      .type('javascript/esm')
    }
  }
})
