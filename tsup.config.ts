import { defineConfig } from 'tsup'
import GlobalsPlugin from 'esbuild-plugin-globals'

export default defineConfig({
  target: 'node12',
  globalName: 'FluentVue',
  splitting: true,
  esbuildPlugins: [
    GlobalsPlugin({
      'vue-demi': 'VueDemi',
      '@fluent/bundle': 'FluentBundle',
    }),
  ],
  external: ['vue-demi', '@fluent/bundle'],
  entry: ['src/index.ts', 'src/composition.ts'],
  format: ['esm', 'cjs', 'iife'],
  dts: true,
  clean: true,
})
