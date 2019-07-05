<script lang="ts">
  export default {
    data () {
      return {
        name: 'Alice'
      }
    }
  }
</script>

<template>
  <div>
    {{ $t('sub-message', { name }) }}
  </div>
</template>
