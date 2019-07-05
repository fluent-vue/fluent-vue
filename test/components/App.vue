<script lang="ts">
  import Child from "./Child.vue";

  export default {
    components: {
      Child
    },
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
    <child />
  </div>
</template>
