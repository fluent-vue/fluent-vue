import { defineConfig } from 'tsup'
import GlobalsPlugin from 'esbuild-plugin-globals'

export default defineConfig([{
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  globalName: 'FluentVue',
  outDir: 'dist/',
  dts: true,
  env: {
    NODE_ENV: 'development'
  },
  esbuildPlugins: [
    GlobalsPlugin({
      'vue-demi': 'VueDemi',
      '@fluent/bundle': 'FluentBundle'
    })
  ],
  external: ['vue-demi', '@fluent/bundle']
},
{
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  globalName: 'FluentVue',
  outDir: 'dist/prod',
  env: {
    NODE_ENV: 'production'
  },
  sourcemap: true,
  minify: true,
  esbuildPlugins: [
    GlobalsPlugin({
      'vue-demi': 'VueDemi',
      '@fluent/bundle': 'FluentBundle'
    })
  ],
  external: ['vue-demi', '@fluent/bundle']
}])
