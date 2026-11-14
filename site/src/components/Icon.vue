<script setup lang="ts">
defineProps<{ name: keyof typeof paths }>()
</script>

<script lang="ts">
const paths = {
  x: 'M6 6l12 12M18 6L6 18',
  menu: 'M4 6h16M4 12h16M4 18h16',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  search: 'M11 4a7 7 0 1 0 0 14a7 7 0 0 0 0-14zM20 20l-3.5-3.5',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  left: 'M15 5l-7 7l7 7',
  right: 'M9 5l7 7l-7 7',
  home: 'M4 11l8-7l8 7M6 10v10h12V10',
  play: 'M8 5l11 7l-11 7z',
}
</script>

<template>
  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path :d="paths[name]" />
  </svg>
</template>

<style>
.icon { width: 1.25em; height: 1.25em; flex: none; }
</style>
