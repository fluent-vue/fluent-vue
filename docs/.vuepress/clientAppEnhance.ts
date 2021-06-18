import { defineClientAppEnhance } from '@vuepress/client'
import { FluentBundle } from '@fluent/bundle'
import { createFluentVue } from 'fluent-vue'
import PrimeVue from 'primevue/config'
import Slider from 'primevue/slider'
import Input from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import SimpleInput from '../components/SimpleInput.vue'
import DateTime from '../components/DateTime.vue'
import DateTimeCustom from '../components/DateTimeCustom.vue'

import { format } from 'date-fns'

const bundle = new FluentBundle('en', {
  functions: {
    DATEFNS (positionalArgs, namedArgs) {
      const [date, formatString] = positionalArgs as [string, string]
      return format(new Date(date), formatString)
    }
  }
})

const fluent = createFluentVue({
  bundles: [bundle],
})

export default defineClientAppEnhance(({ app }) => {
  app.use(fluent)
  app.use(PrimeVue)

  app.component('p-slider', Slider)
  app.component('p-input', Input)
  app.component('p-dropdown', Dropdown)
  app.component('simple-input', SimpleInput)
  app.component('date-time', DateTime)
  app.component('date-time-custom', DateTimeCustom)
})
