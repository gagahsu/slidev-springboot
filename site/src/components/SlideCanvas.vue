<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { SLIDE_H, SLIDE_W, type Slide } from '../lib/deck'
import { SLIDE_KEY, STEP_CONTEXT, reducedMotion } from '../lib/steps'
import DrawLayer from './DrawLayer.vue'

const CoverBackdrop = defineAsyncComponent(() => import('./CoverBackdrop.vue'))

// drawKey: when set, drawings for that key are shown on top of the slide (and editable when a tool is active)
// step: current animation step of the slide. Omit it to show the slide in its final state (previews, thumbnails).
const props = defineProps<{ slide: Slide, drawKey?: string, step?: number }>()
const emit = defineEmits<{ steps: [total: number] }>()

const total = ref(0)
const live = computed(() => props.step !== undefined)
provide(STEP_CONTEXT, {
  step: computed(() => props.step ?? Number.POSITIVE_INFINITY),
  live,
  claim(count) {
    const start = total.value
    total.value += count
    return start
  },
})
// components of the new slide claim their steps as they mount, so reset before they do
watch(() => props.slide, () => { total.value = 0 }, { flush: 'sync' })
watch(total, n => emit('steps', n), { immediate: true })
provide(SLIDE_KEY, computed(() => props.slide.key))
const backdrop = computed(() => live.value && props.slide.layout === 'cover' && !reducedMotion())


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
      <div ref="inner" class="slide-inner" :class="slide.class" :data-css="slide.cssId || undefined" :style="{ zoom: fit }" @load.capture="refit">
        <component :is="'style'" v-if="slide.css">{{ slide.css }}</component>
        <component :is="slide.comp" :key="slide.key" />
      </div>
      <CoverBackdrop v-if="backdrop" />
    </div>
    <DrawLayer v-if="drawKey" :slide-key="drawKey" />
  </div>
</template>

<style>
.slide-canvas { position: relative; width: 100%; overflow: hidden; background: var(--c-snow); }
</style>
