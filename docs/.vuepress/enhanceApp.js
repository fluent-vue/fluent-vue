import SimpleInput from '../components/SimpleInput.vue'
import DateTime from '../components/DateTime.vue'
import { FluentBundle } from '@fluent/bundle'
import { createFluentVue } from 'fluent-vue'
import CompositionApi from '@vue/composition-api'

const bundle = new FluentBundle('en')

const fluent = createFluentVue({
  locale: 'en',
  bundles: [bundle],
})

export default ({ Vue }) => {
  Vue.use(fluent)
  Vue.use(CompositionApi)
  Vue.component('simple-input', SimpleInput)
  Vue.component('date-time', DateTime)
}
