import { Component } from 'vue/types'

export default {
  name: 'i18n',
  functional: true,
  props: {
    path: { type: String, required: true },
    tag: { type: String, default: 'span' },
    data: { type: Object, default: () => ({}) }
  },
  render(h, { parent, props, data, slots }) {
    const key = props.path
    const fluent = parent.$fluent

    const childSlots = slots()

    const params = Object.assign(
      {},
      props.data,
      ...Object.entries(childSlots).map(([key, v]) => ({ [key]: `\uFFFF\uFFFE${key}\uFFFF` }))
    )

    const translation = fluent.format(key, params)

    const parts = translation
      .split('\uFFFF')
      .map(text => (text.startsWith('\uFFFE') ? childSlots[text.replace('\uFFFE', '')] : text))

    return h(props.tag, data, parts)
  }
} as Component
