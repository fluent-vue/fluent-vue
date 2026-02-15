import type { UserConfig } from 'tsdown'
import { defineConfig } from 'tsdown'

const shared: UserConfig = {
  target: 'node16',
  external: ['vue-demi', '@fluent/bundle', '@vue/devtools-api'],
  skipNodeModulesBundle: true,
}

export default defineConfig([
  // Dev: ESM + CJS
  {
    ...shared,
    entry: ['src/index.ts', 'src/composition.ts'],
    format: ['esm', 'cjs'],
    clean: true,
    dts: true,
    outDir: 'dist',
  },
  // Prod: ESM + CJS
  {
    ...shared,
    entry: ['src/index.ts', 'src/composition.ts'],
    format: ['esm', 'cjs'],
    env: {
      NODE_ENV: 'production',
    },
    outDir: 'dist/prod',
  },
  // Prod: IIFE (browser bundle)
  {
    target: 'node16',
    entry: ['src/index.ts'],
    format: ['iife'],
    globalName: 'FluentVue',
    external: ['vue-demi', '@fluent/bundle'],
    noExternal: ['@vue/devtools-api', '@fluent/sequence', 'cached-iterable'],
    inlineOnly: false,
    outputOptions: {
      globals: {
        'vue-demi': 'VueDemi',
        '@fluent/bundle': 'FluentBundle',
      },
    },
    env: {
      NODE_ENV: 'production',
    },
    outDir: 'dist',
  },
])
