import type { FluentResource } from '@fluent/bundle'
import type { FluentVue } from 'src'

import type { App, ComponentInternalInstance } from 'vue-demi'
import type { ResolvedOptions } from '../types'
import { FluentBundle } from '@fluent/bundle'
import { setupDevToolsPlugin } from '@vue/devtools-api'
import { computed, getCurrentInstance, watchEffect } from 'vue-demi'
import pseudoLocalize from './pseudoLocalize'

export function registerFluentVueDevtools(app: App, options: ResolvedOptions, fluent: FluentVue) {
  let currentPseudoLocalize: ((str: string) => string) | undefined
  const missingTranslations: WeakMap<ComponentInternalInstance, Set<string>> = new WeakMap()

  // Hook into options and app
  const oldWarnMissing = options.warnMissing
  options.warnMissing = (key) => {
    const instance = getCurrentInstance()

    oldWarnMissing(key)

    if (!instance)
      return

    missingTranslations.set(instance, missingTranslations.get(instance) ?? new Set())
    missingTranslations.get(instance)!.add(key)
  }

  // Hook into bundle tranform
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

  const cleanBundles = computed(() => {
    return [...fluent.bundles]
      .map((bundle) => {
        const newBundle = new FluentBundle(bundle.locales, {
          functions: bundle._functions,
          useIsolating: bundle._useIsolating,
        })
        newBundle._terms = bundle._terms
        newBundle._messages = bundle._messages
        return newBundle
      })
  })

  setupDevToolsPlugin({
    id: 'fluent-vue',
    label: 'fluent-vue',
    packageName: 'fluent-vue',
    homepage: 'https://fluent-vue.demivan.me',
    logo: 'https://fluent-vue.demivan.me/assets/logo.svg',
    componentStateTypes: ['fluent-vue'],
    app,
    settings: {
      components: {
        label: 'Components',
      } as any, // Use option as a header
      showLocalized: {
        defaultValue: true,
        label: 'Mark localized',
        description: 'Mark localized components in component tree',
        type: 'boolean',
      },
      markMissing: {
        defaultValue: true,
        label: 'Mark missing',
        description: 'Mark missing translations in component tree',
        type: 'boolean',
      },
      showI18n: {
        defaultValue: true,
        label: 'Mark i18n',
        description: 'Mark i18n components in component tree',
        type: 'boolean',
      },
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
    api.on.visitComponentTree(({ treeNode, componentInstance }) => {
      const settings = api.getSettings()

      if (settings.showI18n && treeNode.name === options.componentName) {
        treeNode.tags.push({
          label: 'fluent-vue',
          textColor: 0x000000,
          backgroundColor: 0x41B883,
        })
      }

      if (settings.showLocalized && componentInstance?.proxy?.$options.fluent != null) {
        treeNode.tags.push({
          label: 'localized',
          textColor: 0x000000,
          backgroundColor: 0x41B883,
        })
      }

      const missing = missingTranslations.get(componentInstance)
      if (settings.markMissing && missing != null && missing.size > 0) {
        treeNode.tags.push({
          label: 'missing translations',
          textColor: 0xFFFFFF,
          backgroundColor: 0xB00020,
        })
      }
    })

    api.on.inspectComponent(({ componentInstance, instanceData }) => {
      const missing = missingTranslations.get(componentInstance)
      if (missing) {
        for (const key of missing.values()) {
          instanceData.state.push({
            type: 'Missing translations',
            key,
            editable: false,
            value: {
              _custom: {
                type: 'custom',
                display: '<span style="color:#B00020">Missing</span>',
              },
            },
          })
        }
      }

      const componentFluent = componentInstance?.proxy?.$options.fluent as Record<string, FluentResource>
      if (!componentFluent)
        return

      const bundles = cleanBundles.value
      for (const [locale, messages] of Object.entries(componentFluent)) {
        const bundle = bundles.find(bundle => bundle.locales.includes(locale))

        for (const message of messages.body) {
          const overridesGlobal = bundle?.hasMessage(message.id) ?? false

          instanceData.state.push({
            type: `Component translations (${locale})`,
            key: message.id,
            editable: false,
            value: {
              _custom: {
                type: 'custom',
                display:
                  (message.value ? bundle?.formatPattern(message.value, {}, []) : '')
                  + (overridesGlobal ? '&nbsp;<span style="color:#ffa726">Global</span>' : ''),
              },
            },
          })
        }
      }
    })

    api.on.getInspectorTree((payload) => {
      if (payload.inspectorId === 'fluent-vue-inspector') {
        payload.rootNodes = [
          {
            id: 'global',
            label: `Global translations`,
            children: cleanBundles.value.map(bundle => ({
              id: bundle.locales.join(','),
              label: bundle.locales.join(','),
              children: [...bundle._messages.entries()].map(([_, message]) => ({
                id: message.id,
                label: `${message.id}: ${message.value ? bundle.formatPattern(message.value, {}, []) : ''}`,
              })),
            })),
          },
        ]
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
