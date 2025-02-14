import type { Options } from 'tsup'
import GlobalsPlugin from 'esbuild-plugin-globals'
import { defineConfig } from 'tsup'

function getConfig(overrides: Partial<Options> = {}): Options {
  return {
    target: 'node16',
    globalName: 'FluentVue',
    splitting: true,
    esbuildPlugins: [
      GlobalsPlugin({
        'vue-demi': 'VueDemi',
        '@fluent/bundle': 'FluentBundle',
      }),
    ],
    external: ['vue-demi', '@fluent/bundle', '@vue/devtools-api'],
    entry: ['src/index.ts', 'src/composition.ts'],
    format: ['esm', 'cjs', 'iife'],
    ...overrides,
  }
}

export default defineConfig([
  getConfig({
    clean: true,
    dts: true,
    outDir: 'dist',
  }),
  getConfig({
    clean: false,
    dts: false,
    env: {
      NODE_ENV: 'production',
    },
    outDir: 'dist/prod',
  }),
])
