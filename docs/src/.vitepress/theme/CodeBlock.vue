<template>
  <div class="code-block" :class="[active && 'active']">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  active: { type: Boolean, default: false }
})
</script>

<style scoped>
.code-block {
  display: none;
}

.code-block.active {
  display: block;
}
</style>
