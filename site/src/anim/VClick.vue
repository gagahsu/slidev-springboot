<script setup lang="ts">
import { animate } from 'motion'
import { onMounted, ref, watch } from 'vue'
import { useSteps } from '../lib/steps'

// <v-click> reveals its whole content on one step.
const root = ref<HTMLElement>()
const { local, live, animated, claim } = useSteps()

onMounted(() => {
  claim(1)
  const el = root.value!
  if (live.value) el.classList.toggle('step-hidden', local.value < 1)
  watch(local, (now) => {
    el.classList.toggle('step-hidden', now < 1)
    if (now >= 1 && animated()) animate(el, { opacity: [0, 1], y: [14, 0] }, { type: 'spring', stiffness: 260, damping: 24 })
  })
})
</script>

<template>
  <div ref="root" class="v-click"><slot /></div>
</template>
