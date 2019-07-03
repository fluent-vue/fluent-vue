<script lang="ts">
  export default {
    data () {
      return {
        name: 'John'
      }
    }
  }
</script>

<template>
  <div>
    {{ $t('message', { name }) }}
  </div>
</template>
