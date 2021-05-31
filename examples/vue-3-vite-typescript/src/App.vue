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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'typescript',
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

<style>
.test {
  display: block;
}
</style>
