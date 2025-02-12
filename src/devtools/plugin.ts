import type { FluentBundle } from '@fluent/bundle'

import type { FluentVue } from 'src'
import type { App } from 'vue-demi'
import type { ResolvedOptions } from '../types'
import { setupDevToolsPlugin } from '@vue/devtools-api'
import { watchEffect } from 'vue-demi'
import pseudoLocalize from './pseudoLocalize'

export function registerFluentVueDevtools(app: App, options: ResolvedOptions, fluent: FluentVue) {
  // Hook into bundle tranform
  let currentPseudoLocalize: ((str: string) => string) | undefined

  const hookedBundles = new WeakSet<FluentBundle>()

  watchEffect(() => {
    const bundles = fluent.bundles

    for (const bundle of bundles) {
      if (hookedBundles.has(bundle))
        continue

      const userTransform = bundle._transform
      bundle._transform = (str) => {
        if (userTransform != null)
          str = userTransform(str)

        if (currentPseudoLocalize != null)
          str = currentPseudoLocalize(str)

        return str
      }

      hookedBundles.add(bundle)
    }
  }, { flush: 'sync' })

  setupDevToolsPlugin({
    id: 'fluent-vue',
    label: 'fluent-vue',
    packageName: 'fluent-vue',
    homepage: 'https://fluent-vue.demivan.me',
    logo: 'https://fluent-vue.demivan.me/assets/logo.svg',
    componentStateTypes: ['fluent-vue'],
    app,
    settings: {
      pseudo: {
        label: 'Pseudolocalization',
      } as any, // Use option as a header
      pseudoEnable: {
        defaultValue: false,
        label: 'Enable',
        description: 'Enable pseudolocalization',
        type: 'boolean',
      },
      pseudoAccents: {
        defaultValue: true,
        label: 'Accents',
        description: 'Enable pseudolocalization accents',
        type: 'boolean',
      },
      pseudoPrefix: {
        label: 'Prefix',
        type: 'text',
        description: 'Prefix to wrap translation',
        defaultValue: '[',
      },
      pseudoSuffix: {
        label: 'Suffix',
        type: 'text',
        description: 'Suffix to wrap translation',
        defaultValue: ']',
      },
    },
  }, (api) => {
    api.on.visitComponentTree(({ treeNode }) => {
      if (treeNode.name === options.componentName) {
        treeNode.tags.push({
          label: 'fluent-vue',
          textColor: 0x000000,
          backgroundColor: 0x41B883,
        })
      }
    })

    function handleSettingsChange(settings: {
      pseudoEnable: boolean
      pseudoType: string
      pseudoPrefix: string
      pseudoSuffix: string
      pseudoAccents: boolean
    }) {
      if (settings.pseudoEnable) {
        currentPseudoLocalize = str => pseudoLocalize(str, {
          prefix: settings.pseudoPrefix ?? undefined,
          suffix: settings.pseudoSuffix ?? undefined,
          accents: settings.pseudoAccents ?? false,
        })
      }
      else {
        currentPseudoLocalize = undefined
      }

      // Force update app as if bundles changed
      fluent.bundles = [...fluent.bundles]
    }

    api.on.setPluginSettings((payload) => {
      handleSettingsChange(payload.settings)
    })

    handleSettingsChange(api.getSettings())

    api.addInspector({
      id: 'fluent-vue-inspector',
      label: 'fluent-vue',
    })
  })
}
