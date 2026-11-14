<script setup lang="ts">
import { computed } from 'vue'

// Slidev-compatible <Link to="ch04"> / <Link to="home">
const props = defineProps<{ to: string | number }>()
const target = computed(() => /^ch\d+$/.test(String(props.to)) ? `/${props.to}/1` : '/')
</script>

<template>
  <RouterLink :to="target"><slot /></RouterLink>
</template>
