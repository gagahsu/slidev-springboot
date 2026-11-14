<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SLIDE_H, SLIDE_W, type Slide } from '../lib/deck'

const props = defineProps<{ slide: Slide }>()

const SECTION_COLORS = ['green', 'blue', 'purple', 'orange']

const box = ref<HTMLElement>()
const inner = ref<HTMLElement>()
const scale = ref(1)
/** content shrink factor applied when a slide's content is taller than the canvas */
const fit = ref(1)

const classes = computed(() => {
  const s = props.slide
  const color = s.layout === 'section' ? `u-${SECTION_COLORS[(s.section - 1) % SECTION_COLORS.length]}` : ''
  return [`layout-${s.layout}`, color]
})

let ro: ResizeObserver | undefined
let mo: MutationObserver | undefined
let token = 0

async function refit() {
  const my = ++token
  fit.value = 1
  await nextTick()
  const el = inner.value
  if (!el) return
  for (let n = 0; n < 6 && my === token; n++) {
    const over = el.scrollHeight / el.clientHeight
    if (over <= 1.005 || fit.value <= 0.5) break
    fit.value = Math.max(0.5, fit.value / over * 0.985)
    await nextTick()
  }
}

onMounted(() => {
  ro = new ResizeObserver(([e]) => { scale.value = e.contentRect.width / SLIDE_W })
  ro.observe(box.value!)
  // content that renders late (mermaid diagrams) changes the height after the first fit
  mo = new MutationObserver(refit)
  mo.observe(inner.value!, { childList: true, subtree: true })
  refit()
  document.fonts?.ready.then(refit)
})
onBeforeUnmount(() => { ro?.disconnect(); mo?.disconnect() })
watch(() => props.slide, refit)
</script>

<template>
  <div ref="box" class="slide-canvas" :style="{ aspectRatio: `${SLIDE_W} / ${SLIDE_H}` }">
    <div class="slide" :class="classes" :style="{ transform: `scale(${scale})` }">
      <div ref="inner" class="slide-inner" :class="slide.class" :style="{ zoom: fit }" @load.capture="refit">
        <component :is="slide.comp" :key="slide.index" />
      </div>
    </div>
  </div>
</template>

<style>
.slide-canvas { position: relative; width: 100%; overflow: hidden; background: var(--c-snow); }
</style>
