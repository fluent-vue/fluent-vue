// Workaround for:
// src/nuxt.ts(5,1): error TS2742: The inferred type of 'default' cannot be named without a reference to '.pnpm/@nuxt+schema@3.0.0_rollup@2.79.0/node_modules/@nuxt/schema'. This is likely not portable. A type annotation is necessary.
import type { } from '@nuxt/schema'
import type { ExternalPluginOptionsFolder, ExternalPluginOptionsFunction } from './types'

import type { SFCPluginOptions } from './vite'
import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import { directiveTransform } from './directive-transform'
import { ExternalFluentPlugin, SFCFluentPlugin } from './vite'

interface NuxtFluentOptions {
  sfc?: SFCPluginOptions
  external?: Omit<ExternalPluginOptionsFolder, 'baseDir'> | ExternalPluginOptionsFunction
  /**
   * @default 't' v-t directive name for the directive transform
   */
  directiveName?: string
}

export default defineNuxtModule<NuxtFluentOptions>({
  meta: {
    name: 'fluent-vue',
    configKey: 'fluentVue',
  },
  setup(options, nuxt) {
    if (!options.sfc && !options.external) {
      console.error(`[fluent-vue/nuxt] You need to enable at least one of the fluent-vue plugins`)
      return
    }

    nuxt.options.vue.compilerOptions.directiveTransforms ??= {}
    nuxt.options.vue.compilerOptions.directiveTransforms[options.directiveName ?? 't'] = directiveTransform

    if (options.sfc)
      addVitePlugin(SFCFluentPlugin(options.sfc))

    if (options.external) {
      const externalOptions = {
        ...options.external,
        baseDir: nuxt.options.srcDir,
      }
      addVitePlugin(ExternalFluentPlugin(externalOptions))
    }
  },
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    fluentVue?: NuxtFluentOptions
  }
  interface NuxtOptions {
    fluentVue?: NuxtFluentOptions
  }
}
