<script setup lang="ts">
import { computed, ref } from 'vue'
import { SLIDE_H, SLIDE_W } from '../lib/deck'
import { arrowHead, draw, erase, hits, newId, pointLaser, strokePath, strokesOf, upsert, type Stroke } from '../lib/draw'

const props = defineProps<{ slideKey: string }>()

const svg = ref<SVGSVGElement>()
const strokes = computed(() => strokesOf(props.slideKey))
const laser = computed(() => draw.laser?.key === props.slideKey ? draw.laser : null)
const active = computed(() => draw.tool !== 'none')

let current: Stroke | null = null
let erasing = false

function point(e: PointerEvent): [number, number] {
  const r = svg.value!.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width * SLIDE_W
  const y = (e.clientY - r.top) / r.height * SLIDE_H
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10]
}

function eraseAt(x: number, y: number) {
  for (const s of [...strokes.value]) if (hits(s, x, y)) erase(props.slideKey, s.id)
}

function down(e: PointerEvent) {
  if (!active.value || e.button !== 0) return
  const [x, y] = point(e)
  const tool = draw.tool
  if (tool === 'laser') return
  svg.value!.setPointerCapture(e.pointerId)
  if (tool === 'eraser') { erasing = true; eraseAt(x, y); return }
  if (tool === 'none') return
  current = {
    id: newId(),
    tool,
    color: draw.color,
    size: tool === 'marker' ? draw.size * 3.2 : draw.size,
    pts: tool === 'pen' || tool === 'marker' ? [x, y] : [x, y, x, y],
  }
  upsert(props.slideKey, current, false)
}

function move(e: PointerEvent) {
  if (!active.value) return
  const [x, y] = point(e)
  if (draw.tool === 'laser') { pointLaser(props.slideKey, x, y, true); return }
  if (erasing) { eraseAt(x, y); return }
  if (!current) return
  const p = current.pts
  if (current.tool === 'pen' || current.tool === 'marker') {
    if (Math.hypot(x - p[p.length - 2], y - p[p.length - 1]) < 1.6) return
    p.push(x, y)
  }
  else {
    p[2] = x
    p[3] = y
  }
  upsert(props.slideKey, current, false)
}

function up() {
  erasing = false
  if (!current) return
  const s = current
  current = null
  const tiny = (s.tool === 'arrow' || s.tool === 'rect') && Math.hypot(s.pts[2] - s.pts[0], s.pts[3] - s.pts[1]) < 4
  if (tiny) erase(props.slideKey, s.id)
  else upsert(props.slideKey, s, true)
}

function leave() {
  if (draw.tool === 'laser') pointLaser(props.slideKey, 0, 0, false)
}
</script>

<template>
  <svg
    ref="svg" class="draw-layer" :class="[`tool-${draw.tool}`, { active }]"
    :viewBox="`0 0 ${SLIDE_W} ${SLIDE_H}`" preserveAspectRatio="none"
    @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="up" @pointerleave="leave"
  >
    <template v-for="s in strokes" :key="s.id">
      <rect
        v-if="s.tool === 'rect'" fill="none" :stroke="s.color" :stroke-width="s.size" rx="6"
        :x="Math.min(s.pts[0], s.pts[2])" :y="Math.min(s.pts[1], s.pts[3])"
        :width="Math.abs(s.pts[2] - s.pts[0])" :height="Math.abs(s.pts[3] - s.pts[1])"
      />
      <g v-else-if="s.tool === 'arrow'">
        <line :x1="s.pts[0]" :y1="s.pts[1]" :x2="s.pts[2]" :y2="s.pts[3]" :stroke="s.color" :stroke-width="s.size" stroke-linecap="round" />
        <path :d="arrowHead(s)" :fill="s.color" :stroke="s.color" :stroke-width="s.size * 0.6" stroke-linejoin="round" />
      </g>
      <path
        v-else :d="strokePath(s)" fill="none" :stroke="s.color" :stroke-width="s.size"
        stroke-linecap="round" stroke-linejoin="round" :class="{ marker: s.tool === 'marker' }"
      />
    </template>
    <g v-if="laser" class="laser" :transform="`translate(${laser.x} ${laser.y})`">
      <circle r="16" fill="rgba(255, 45, 45, .22)" />
      <circle r="6" fill="#ff2d2d" stroke="#fff" stroke-width="1.5" />
    </g>
  </svg>
</template>

<style>
.draw-layer { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 5; pointer-events: none; touch-action: none; }
.draw-layer.active { pointer-events: auto; cursor: crosshair; }
.draw-layer.tool-eraser { cursor: cell; }
.draw-layer.tool-laser { cursor: none; }
.draw-layer .marker { opacity: .38; mix-blend-mode: multiply; }
.draw-layer .laser { pointer-events: none; }
</style>
