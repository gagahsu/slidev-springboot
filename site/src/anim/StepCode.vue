<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'
import { useSteps } from '../lib/steps'
import { CODE_GROUP } from './codeGroup'

// Wraps a code block written as ```java {1|3-4|all}: each `|` section is one state, advanced by a step.
const props = defineProps<{ steps: string }>()
const root = ref<HTMLElement>()
const { local, claim } = useSteps()
const group = inject(CODE_GROUP, null)

function parse(spec: string, lineCount: number): Set<number> | null {
  const s = spec.trim()
  if (!s || s === 'all' || s === '*') return null
  const out = new Set<number>()
  for (const part of s.split(',')) {
    const [a, b] = part.split('-').map(n => Number.parseInt(n, 10))
    if (!Number.isFinite(a)) continue
    for (let n = a; n <= Math.min(Number.isFinite(b) ? b : a, lineCount); n++) out.add(n)
  }
  return out
}

onMounted(() => {
  const lines = [...root.value!.querySelectorAll<HTMLElement>('.line')]
  const states = props.steps.split('|').map(s => parse(s, lines.length))
  claim(states.length - 1)
  const apply = (k: number) => {
    const set = states[Math.min(k, states.length - 1)]
    lines.forEach((el, i) => {
      el.classList.toggle('hl', !!set && set.has(i + 1))
      el.classList.toggle('dim', !!set && !set.has(i + 1))
    })
    if (group) group.state.value = k
  }
  apply(local.value)
  watch(local, apply)
})
</script>

<template>
  <div ref="root" class="step-code"><slot /></div>
</template>
