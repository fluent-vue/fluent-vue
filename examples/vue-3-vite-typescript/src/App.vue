<template>
  <div>
    <h3>Examples</h3>

    <h4>$t method</h4>
    <div>
      <span>{{ $t('greeting', { name: 'World' }) }}</span>
    </div>

    <h4>$ta method</h4>
    <div>
      <span v-bind="$ta('greeting')">{{ $t('greeting', { name: 'World' }) }}</span>
    </div>

    <h4>Directive</h4>
    <div>
      <span v-t:greeting="{ name: 'World' }"></span>
    </div>

    <h4>Component</h4>
    <div>
      <i18n path="greeting" tag="div">
        <template #name>
          <b>{{ $t('user-name') }}</b>
        </template>
      </i18n>
    </div>

    <h4>Composition api (useFluent)</h4>
    <div v-bind="compositionGreetingTa">
      {{ compositionGreeting }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useFluent } from 'fluent-vue'

export default defineComponent({
  name: 'typescript',
  setup () {
    const { $t, $ta } = useFluent()

    return {
      compositionGreeting: $t('greeting', { name: $t('user-name') }),
      compositionGreetingTa: $ta('greeting', { name: $t('user-name') })
    }
  },
  computed: {
    username() {
      return this.$t('user-name')
    },
    greeting() {
      return this.$ta('greeting')
    },
  },
})
</script>

<fluent locale="en">
user-name = World
aria-key = Aria value
greeting = Hello, {$name}
  .aria-label = Label value
</fluent>

<style>
.test {
  display: block;
}
</style>
