import { Component } from 'vue/types'

export default {
  name: 'i18n',
  functional: true,
  props: {
    path: { type: String, required: true },
    tag: { type: String, default: 'span' },
    data: { type: Object, default: () => ({}) }
  },
  render(h, { parent, props, data }) {
    const key = props.path
    const fluent = parent.$fluent

    const translation = fluent.format(key)

    return h(props.tag, data, translation)
  }
} as Component
