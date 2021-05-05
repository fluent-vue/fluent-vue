<script>
export default {
  data () {
    return {
      now: new Date()
    }
  }
}
</script>

<template>
  <p class="demo">
    {{ $t('default', { now }) }}<br>
    {{ $t('today', { now }) }}<br>
    {{ $t('now', { now }) }}
  </p>
</template>

<fluent locale="en">
default = Now is {{ $now }}
today = Today is {{ DATEFNS($now, "PP") }}
now = It is {{ DATEFNS($now, "p") }}
</fluent>
