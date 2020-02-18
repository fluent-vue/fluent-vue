import { FunctionalComponentOptions } from 'vue'
import { RecordPropsDefinition } from 'vue/types/options'

interface ComponentProps {
  path: string
  tag?: string
  args?: Record<string, unknown>
}

const component: FunctionalComponentOptions<
  ComponentProps,
  RecordPropsDefinition<ComponentProps>
> = {
  name: 'i18n',
  functional: true,
  props: {
    path: { type: String, required: true },
    tag: { type: String, default: 'span' },
    args: { type: Object, default: () => ({}) }
  },
  render(h, { parent, props, data, slots }) {
    const key = props.path
    const fluent = parent.$fluent

    const childSlots = slots()

    const params = Object.assign(
      {},
      props.args,
      ...Object.entries(childSlots).map(([key, v]) => ({ [key]: `\uFFFF\uFFFE${key}\uFFFF` }))
    )

    const translation = fluent.format(key, params)

    const parts = translation
      .split('\uFFFF')
      .map(text => (text.startsWith('\uFFFE') ? childSlots[text.replace('\uFFFE', '')] : text))

    return h(props.tag, data, parts)
  }
}

export default component
