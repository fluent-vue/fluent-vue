<template>
  <div>
    <h3>Examples</h3>

    <h4>$t method</h4>
    <div>
      <span>
        {{ $t('greeting', { name: 'World' }) }}
      </span>
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
          <b>{{ username }}</b>
        </template>
      </i18n>
    </div>
  </div>
</template>

<script setup>
import { useFluent } from 'fluent-vue'
const fluent = useFluent()

const username = fluent.$t('user-name')
</script>

<fluent locale="en">
user-name = World
aria-key = Aria value
greeting = Hello, {$name}
  .aria-label = Label value
</fluent>
