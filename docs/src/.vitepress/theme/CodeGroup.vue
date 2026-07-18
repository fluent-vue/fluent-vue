<script setup>
import { onMounted, computed, ref, useSlots, watch } from 'vue'

const slots = useSlots()
const tabLabels = computed(() => slots.default().map(key => key.props.title))

const activeTabIndex = ref(0)
const tabs = ref([])

const underline = ref(null)

const updateHighlighteUnderlinePosition = () => {
  const activeTab = tabs.value[activeTabIndex.value]
  if (!activeTab) {
    return
  }
  
  underline.value.style.left = `${activeTab.offsetLeft}px`
  underline.value.style.width = `${activeTab.clientWidth}px`
}

onMounted(() => {
  updateHighlighteUnderlinePosition()
})

const slot = ref(null)

const switchTab = (i) => {
  const tabs = slot.value.children

  for (const tab of tabs) {
    tab.classList.remove('active')
  }

  tabs[i].classList.add('active')
}

watch(activeTabIndex, (value) => {
  switchTab(value)
})

const updateTabs = i => {
  activeTabIndex.value = i
  updateHighlighteUnderlinePosition()
}
</script>

<template>
  <div class="code-group">
    <div class="buttons">
      <button
        v-for="(label, i) in tabLabels"
        ref="tabs"
        :key="label"
        class="button mono"
        :class="[activeTabIndex === i && 'active']"
        @click="updateTabs(i)"
      >{{ label }}</button>
      <span ref="underline" class="highlight-underline" />
    </div>
    <div ref="slot">
      <slot ref="inner" />
    </div>
  </div>
</template>

<style scoped>
.buttons {
  border: 0 solid #e2e8f0;
  border-top-left-radius: .375rem;
  border-top-right-radius: .375rem;
  border-bottom-width: 2px;
  border-color: #4a5568;
  padding-left: .5rem;
  padding-right: .5rem;
  background-color: #2d3748;
  font-size: .875rem;
  line-height: 1.25rem;
  color: #fff;
  position: relative;
}

button {
  outline: none;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: .75rem;
  padding-bottom: .75rem;
  color: #cbd5e0;
  font-weight: 700;
}

.highlight-underline {
  background-color: #00cd81;
  position: absolute;
  bottom: -2px;
  height: 2px;
  transition: left .15s,width .15s;
  bottom: -2px;
  height: 2px;
  transition: left 150ms, width 150ms;
}

.code-group :deep([class*="language-"]){
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  margin-top: 0;
}
</style>
