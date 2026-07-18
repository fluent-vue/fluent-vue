<script setup>
import { useNow } from '@vueuse/core'

const now = useNow()
</script>

// #region snippet
<template>
  <p class="demo">
    {{ $t('default', { now }) }}<br>
    {{ $t('today', { now }) }}<br>
    {{ $t('now', { now }) }}
  </p>
</template>

<fluent locale="en">
default = Current date: {{ $now }}
today = Today is {{ DATEFNS($now, "PP") }}
now = It is {{ DATEFNS($now, "pp") }}
</fluent>
// #endregion snippet
