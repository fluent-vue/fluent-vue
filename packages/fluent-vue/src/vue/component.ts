import { defineComponent, h, getCurrentInstance, Vue, inject, computed } from 'vue-demi'
import { getContext } from '../composition'
import { RootContextSymbol } from '../symbols'

function getParent(instance: Vue | null): Vue {
  return instance?.$parent ?? (instance as any)?.parent.proxy
}

export default defineComponent({
  name: 'i18n',
  props: {
    path: { type: String, required: true },
    tag: { type: String, default: 'span' },
    args: { type: Object, default: () => ({}) },
  },
  setup(props, context) {
    const childSlots = context.slots

    const params = Object.assign(
      {},
      props.args,
      ...Object.keys(childSlots).map((key) => ({
        [key]: `\uFFFF\uFFFE${key}\uFFFF`,
      }))
    )

    const translation = computed(() => {
      const rootContext = inject(RootContextSymbol)!
      const instance = getCurrentInstance()
      const parent = getParent(instance)
      const fluent = getContext(rootContext, parent)
      return fluent.format(props.path, params)
    })

    return () =>
      h(
        props.tag,
        context,
        translation.value
          .split('\uFFFF')
          .map((text) =>
            text.startsWith('\uFFFE') ? childSlots[text.replace('\uFFFE', '')]?.() : text
          ) as any
      )
  },
})
