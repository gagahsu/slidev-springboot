<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import type { Slide } from '../lib/deck'
import Icon from './Icon.vue'
import SlideCanvas from './SlideCanvas.vue'

const props = defineProps<{ slides: Slide[], index: number, title: string }>()
const emit = defineEmits<{ close: [], go: [i: number] }>()

// thumbnails render lazily as they scroll into view
const visible = reactive(new Set<number>())
const root = ref<HTMLElement>()
let io: IntersectionObserver | undefined

onMounted(async () => {
  io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        visible.add(Number((e.target as HTMLElement).dataset.i))
        io!.unobserve(e.target)
      }
    }
  }, { root: root.value, rootMargin: '300px' })
  await nextTick()
  root.value?.querySelectorAll('.thumb').forEach(el => io!.observe(el))
  const cur = root.value?.querySelector<HTMLElement>('.thumb.current')
  cur?.scrollIntoView({ block: 'center' })
  cur?.focus()
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <div class="overview" role="dialog" aria-label="投影片總覽" @keydown.esc.stop="emit('close')">
    <header>
      <strong>{{ title }}</strong>
      <span>{{ slides.length }} 頁</span>
      <button class="btn square" aria-label="關閉總覽" @click="emit('close')"><Icon name="x" /></button>
    </header>
    <div ref="root" class="grid">
      <button
        v-for="(s, i) in slides" :key="i" class="thumb" :class="{ current: i === props.index }" :data-i="i"
        :aria-label="`第 ${i + 1} 頁 ${s.title}`" @click="emit('go', i)"
      >
        <div class="frame"><SlideCanvas v-if="visible.has(i)" :slide="s" /></div>
        <span class="n">{{ i + 1 }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.overview { position: fixed; inset: 0; z-index: 60; display: flex; flex-direction: column; background: var(--c-polar); }
header { display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-bottom: 2px solid var(--c-line); background: var(--c-snow); font-size: 19px; font-weight: 900; }
header span { flex: 1; color: var(--c-muted); font-size: 14px; font-weight: 800; }
.grid { flex: 1; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); align-content: start; gap: 18px; padding: 20px; }
.thumb { position: relative; padding: 0; border: 0; background: none; cursor: pointer; text-align: left; outline: 0; }
.frame { aspect-ratio: 980 / 552; border: 2px solid var(--c-line); border-radius: 12px; box-shadow: 0 3px 0 var(--c-line); background: var(--c-snow); overflow: hidden; pointer-events: none; }
.thumb:hover .frame, .thumb:focus-visible .frame { border-color: #84d8ff; box-shadow: 0 3px 0 #84d8ff; }
.thumb.current .frame { border-color: var(--c-blue); box-shadow: 0 3px 0 var(--c-blue-dark); }
.n { position: absolute; left: 8px; bottom: 9px; padding: 1px 8px; border-radius: 8px; background: rgba(19, 31, 36, .72); color: #fff; font-size: 12px; font-weight: 800; }
.thumb.current .n { background: var(--c-blue); }
</style>
