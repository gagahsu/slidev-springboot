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
  pause: 'M8 5v14M16 5v14',
  reset: 'M4 12a8 8 0 1 0 3-6.2M4 4v5h5',
  present: 'M3 5h18v11H3zM12 16v4M8 20h8',
  window: 'M4 5h16v14H4zM4 9h16',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  cursor: 'M6 4l12 7l-5 2l-2 5z',
  pen: 'M4 20l4-1L19 8l-3-3L5 16z',
  marker: 'M4 20h16M8 15l6-9l4 3l-6 9z',
  arrow: 'M5 19L19 5M10 5h9v9',
  rect: 'M4 6h16v12H4z',
  eraser: 'M9 20h11M4 15l9-9l6 6l-8 8H8z',
  laser: 'M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6zM12 3v2M12 19v2M3 12h2M19 12h2',
  undo: 'M8 5L3 10l5 5M3 10h11a5 5 0 0 1 0 10h-3',
  redo: 'M16 5l5 5l-5 5M21 10H10a5 5 0 0 0 0 10h3',
  wifi: 'M3 9a14 14 0 0 1 18 0M6.5 12.5a9 9 0 0 1 11 0M10 16a4 4 0 0 1 4 0M12 19.5v.01',
  chat: 'M4 5h16v11H9l-5 4z',
  qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z',
  check: 'M5 12l5 5L19 7',
  trash: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13',
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
