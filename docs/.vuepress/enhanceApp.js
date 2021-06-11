import { FluentBundle } from '@fluent/bundle'
import { createFluentVue } from 'fluent-vue'
import CompositionApi from '@vue/composition-api'

import SimpleInput from '../components/SimpleInput.vue'
import DateTime from '../components/DateTime.vue'
import DateTimeCustom from '../components/DateTimeCustom.vue'

// #region datefns
import { format } from 'date-fns'

const bundle = new FluentBundle('en', {
  functions: {
    DATEFNS(positionalArgs, namedArgs) {
      const [date, formatString] = positionalArgs
      return format(new Date(date), formatString)
    },
  },
})

const fluent = createFluentVue({
  bundles: [bundle],
})
// #endregion datefns

export default ({ Vue }) => {
  Vue.use(fluent)
  Vue.use(CompositionApi)
  Vue.component('simple-input', SimpleInput)
  Vue.component('date-time', DateTime)
  Vue.component('date-time-custom', DateTimeCustom)
}
