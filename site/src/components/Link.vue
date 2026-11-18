<script setup lang="ts">
import { computed } from 'vue'
import { currentCourseId } from '../lib/course'

// Slidev-compatible <Link to="ch04"> / <Link to="home">, resolved inside the course being viewed
const props = defineProps<{ to: string | number }>()
const target = computed(() => {
  const course = currentCourseId.value
  if (!course) return '/'
  return /^ch\d+$/.test(String(props.to)) ? `/${course}/${props.to}/1` : `/${course}`
})
</script>

<template>
  <RouterLink :to="target"><slot /></RouterLink>
</template>
