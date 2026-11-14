<script setup lang="ts">
import { animate } from 'motion'
import { computed, onMounted, ref, watch } from 'vue'
import { useSteps } from '../lib/steps'

/**
 * Animated sequence diagram.
 *   <Flow nodes="Postman|Spring Boot|Console" steps="1>2:GET /test|2>3:印出 Hi!|2>1:200 OK" />
 * nodes: names separated by `|` (optional `名稱:副標`). steps: `from>to:label`, one message per step.
 */
const props = defineProps<{ nodes: string, steps: string }>()
const W = 860
const TOP = 62
const ROW = 46

const nodes = computed(() => props.nodes.split('|').map((n, i, all) => {
  const [name, sub = ''] = n.split(':')
  return { name: name.trim(), sub: sub.trim(), x: W * (i + 0.5) / all.length }
}))
const messages = computed(() => props.steps.split('|').map((s, k) => {
  const m = s.match(/^\s*(\d+)\s*>\s*(\d+)\s*:(.*)$/)
  const from = nodes.value[Number(m?.[1] ?? 1) - 1] ?? nodes.value[0]
  const to = nodes.value[Number(m?.[2] ?? 1) - 1] ?? nodes.value[0]
  const y = TOP + 34 + k * ROW
  const dir = to.x >= from.x ? 1 : -1
  return { label: (m?.[3] ?? s).trim(), x1: from.x + 8 * dir, x2: to.x - 8 * dir, y, dir, back: dir < 0 }
}))
const height = computed(() => TOP + 34 + messages.value.length * ROW)

const root = ref<SVGSVGElement>()
const { local, animated, claim } = useSteps()

onMounted(() => {
  claim(messages.value.length)
  watch(local, (now, before) => {
    if (now <= before || !animated()) return
    const g = root.value?.querySelector<SVGGElement>(`[data-msg="${now - 1}"]`)
    if (!g) return
    const m = messages.value[now - 1]
    animate(g.querySelector('line')!, { x2: [m.x1, m.x2] }, { duration: 0.45, ease: 'easeOut' })
    animate(g.querySelector('path')!, { opacity: [0, 1] }, { duration: 0.2, delay: 0.4 })
    animate(g.querySelector('.label')!, { opacity: [0, 1], y: [6, 0] }, { duration: 0.3, delay: 0.15 })
  })
})
</script>

<template>
  <svg ref="root" class="flow" :viewBox="`0 0 ${W} ${height}`" :style="{ maxHeight: `${height}px` }" role="img" :aria-label="messages.map(m => m.label).join('，')">
    <g v-for="n in nodes" :key="n.name">
      <line :x1="n.x" :x2="n.x" :y1="TOP" :y2="height - 6" class="life" />
      <rect :x="n.x - 84" y="4" width="168" :height="TOP - 10" rx="16" class="node" />
      <text :x="n.x" :y="n.sub ? 27 : 35" class="name">{{ n.name }}</text>
      <text v-if="n.sub" :x="n.x" y="45" class="sub">{{ n.sub }}</text>
    </g>
    <g v-for="(m, k) in messages" v-show="k < local" :key="k" :data-msg="k" :class="{ back: m.back, latest: k === local - 1 }">
      <line :x1="m.x1" :x2="m.x2" :y1="m.y" :y2="m.y" class="arrow" />
      <path :d="`M${m.x2 + 2 * m.dir} ${m.y}l${-13 * m.dir} -8v16z`" class="head" />
      <g class="label">
        <text :x="(m.x1 + m.x2) / 2" :y="m.y - 9">{{ m.label }}</text>
      </g>
    </g>
  </svg>
</template>

<style>
.flow { display: block; width: 100%; margin: 10px 0; overflow: visible; font-family: var(--font-sans); }
.flow .life { stroke: var(--c-line); stroke-width: 3; stroke-dasharray: 6 6; }
.flow .node { fill: #fff; stroke: var(--c-blue); stroke-width: 3; }
.flow .name { fill: #2b2b2b; font-size: 17px; font-weight: 900; text-anchor: middle; }
.flow .sub { fill: var(--c-ink-soft); font-size: 12px; font-weight: 700; text-anchor: middle; }
.flow .arrow { stroke: var(--c-muted); stroke-width: 4; stroke-linecap: round; }
.flow .head { fill: var(--c-muted); }
.flow .label text { fill: var(--c-ink-soft); font-size: 14.5px; font-weight: 800; text-anchor: middle; }
.flow .latest .arrow { stroke: var(--c-brand); }
.flow .latest .head { fill: var(--c-brand); }
.flow .latest.back .arrow { stroke: var(--c-blue); }
.flow .latest.back .head { fill: var(--c-blue); }
.flow .latest .label text { fill: #2b2b2b; }
</style>
