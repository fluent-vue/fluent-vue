import SimpleInput from '../components/SimpleInput.vue'
import { FluentBundle } from '@fluent/bundle'
import { createFluentVue } from 'fluent-vue'

const bundle = new FluentBundle('en')

const fluent = createFluentVue({
  locale: 'en',
  bundles: [bundle],
})

export default ({ Vue }) => {
  Vue.use(fluent)
  Vue.component('simple-input', SimpleInput)
}
