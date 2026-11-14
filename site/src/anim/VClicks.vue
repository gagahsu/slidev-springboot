<script setup lang="ts">
import { animate } from 'motion'
import { onMounted, ref, watch } from 'vue'
import { useSteps } from '../lib/steps'

// <v-clicks> reveals its children one step at a time: list items, table rows, or direct children.
const root = ref<HTMLElement>()
const { local, live, animated, claim } = useSteps()
let targets: HTMLElement[] = []

function collect(el: HTMLElement): HTMLElement[] {
  const kids = [...el.children] as HTMLElement[]
  if (kids.length === 1) {
    const only = kids[0]
    if (only.matches('ul, ol')) return [...only.children] as HTMLElement[]
    if (only.matches('.table-wrap')) return [...only.querySelectorAll<HTMLElement>('tbody > tr')]
  }
  return kids
}

function apply(shown: number, from: number) {
  targets.forEach((el, i) => {
    const visible = i < shown
    el.classList.toggle('step-hidden', !visible)
    if (visible && i >= from && animated())
      animate(el, { opacity: [0, 1], y: [14, 0] }, { type: 'spring', stiffness: 260, damping: 24 })
  })
}

onMounted(() => {
  targets = collect(root.value!)
  claim(targets.length)
  if (live.value) apply(local.value, targets.length)
  watch(local, (now, before) => apply(now, before))
})
</script>

<template>
  <div ref="root" class="v-clicks"><slot /></div>
</template>
