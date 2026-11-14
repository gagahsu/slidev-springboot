<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref } from 'vue'
import SearchPalette from './components/SearchPalette.vue'

const searchOpen = ref(false)
provide('openSearch', () => { searchOpen.value = true })

function onKey(e: KeyboardEvent) {
  if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !isTyping(e))) {
    e.preventDefault()
    searchOpen.value = true
  }
}
function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null
  return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <RouterView />
  <SearchPalette v-if="searchOpen" @close="searchOpen = false" />
</template>
