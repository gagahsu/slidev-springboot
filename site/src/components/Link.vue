<script setup lang="ts">
import { computed } from 'vue'
import { currentCourseId } from '../lib/course'

// Slidev-compatible <Link to="ch04"> / <Link to="home">, resolved inside the course being viewed.
// <Link to="java-adv/ch23"> points to a chapter of another course.
const props = defineProps<{ to: string | number }>()
const target = computed(() => {
  const to = String(props.to)
  const other = to.match(/^([a-z][a-z0-9-]*)\/(ch\d+)$/)
  if (other) return `/${other[1]}/${other[2]}/1`
  const course = currentCourseId.value
  if (!course) return '/'
  return /^ch\d+$/.test(to) ? `/${course}/${to}/1` : `/${course}`
})
</script>

<template>
  <RouterLink :to="target"><slot /></RouterLink>
</template>
