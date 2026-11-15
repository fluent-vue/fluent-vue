import { FluentBundle } from '@fluent/bundle'
import { createFluentVue } from 'fluent-vue'

export default defineNuxtPlugin((nuxtApp) => {
  const bundles = {
    en: new FluentBundle('en'),
    fr: new FluentBundle('fr'),
  } as const

  const fluent = createFluentVue({
    bundles: [bundles.en],
  })

  nuxtApp.vueApp.use(fluent)

  return {
    provide: {
      changeLocale(locale: keyof typeof bundles) {
        fluent.bundles = [bundles[locale]]
      },
    },
  }
})
