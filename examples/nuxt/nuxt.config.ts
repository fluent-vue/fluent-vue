export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  modules: ['unplugin-fluent-vue/nuxt'],
  fluentVue: {
    external: {
      locales: ['en', 'fr'],
      ftlDir: 'translations/',
    },
  },
})
