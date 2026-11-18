<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import SlideCanvas from '../components/SlideCanvas.vue'
import { SLIDE_H, SLIDE_W, chapterById, loadChapter, type Slide } from '../lib/deck'

// One chapter laid out as one slide per page, in its final state (all animation steps played).
// Used by `pnpm -C site export` and by the browser's own Print → Save as PDF.
const route = useRoute()
const courseId = computed(() => String(route.params.course))
const chapter = computed(() => chapterById(courseId.value, String(route.params.ch)))
const slides = shallowRef<Slide[]>([])
const ready = ref(false)
const plain = (layout: string) => layout === 'default' || layout === 'two-cols'

async function settle() {
  await nextTick()
  await document.fonts?.ready
  await Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise((r) => { i.onload = i.onerror = r })))
  // mermaid diagrams render asynchronously
  for (let n = 0; n < 100 && document.querySelector('.mermaid-box:empty'); n++) await new Promise(r => setTimeout(r, 100))
  await new Promise(r => setTimeout(r, 400))
}

onMounted(async () => {
  if (!chapter.value) return
  document.title = `Ch${String(chapter.value.num).padStart(2, '0')} ${chapter.value.title}`
  slides.value = await loadChapter(courseId.value, chapter.value.id)
  await settle()
  ready.value = true
  ;(window as any).__printReady = true
})

const print = () => window.print()
</script>

<template>
  <div v-if="chapter" class="print-root" :style="{ '--w': `${SLIDE_W}px`, '--h': `${SLIDE_H}px` }">
    <header class="print-bar">
      <RouterLink class="btn" :to="`/${courseId}/${chapter.id}/1`">返回投影片</RouterLink>
      <strong>Ch {{ chapter.num }} · {{ chapter.title }}（{{ chapter.count }} 頁）</strong>
      <button class="btn primary" :disabled="!ready" @click="print">{{ ready ? '列印 / 另存 PDF' : '準備中…' }}</button>
    </header>
    <p class="print-tip">在列印對話框把「目的地」選成「另存為 PDF」，邊界選「無」，並勾選「背景圖形」。動畫頁會以播完的最終畫面輸出。</p>
    <section v-for="(s, i) in slides" :key="s.key" class="print-page">
      <SlideCanvas :slide="s" />
      <footer v-if="plain(s.layout)">Ch {{ chapter.num }} · {{ chapter.title }}　{{ i + 1 }} / {{ slides.length }}</footer>
    </section>
  </div>
  <p v-else class="print-tip">找不到這個章節。</p>
</template>

<style>
@page { size: 980px 552px; margin: 0; }
.print-root { background: var(--c-polar); }
.print-bar { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; gap: 16px; padding: 12px 20px; border-bottom: 2px solid var(--c-line); background: var(--c-snow); }
.print-bar strong { flex: 1; font-size: 17px; font-weight: 900; }
.print-tip { max-width: var(--w, 980px); margin: 14px auto; padding: 0 16px; color: var(--c-ink-soft); font-size: 14px; font-weight: 700; }
.print-page { position: relative; width: var(--w); height: var(--h); margin: 0 auto 16px; overflow: hidden; background: #fff; box-shadow: 0 0 0 2px var(--c-line); break-after: page; break-inside: avoid; }
.print-page > footer { position: absolute; right: 10px; bottom: 4px; z-index: 6; padding: 0 6px; border-radius: 6px; background: rgba(255, 255, 255, .88); color: #a0a0a0; font-size: 10px; font-weight: 700; }
/* links that only make sense on the live site */
.print-page .layout-cover a { display: none; }

/* paper has no steps: show stepped content in full */
.print-page .step-code .line.dim { opacity: 1; }
.print-page .step-code .line.hl { background: none; box-shadow: none; }
.print-page .code-steps .captions { display: block; }
.print-page .code-steps .captions > li { visibility: visible; margin-top: 6px; padding: 5px 14px; font-size: 14.5px; }
.print-page .poll .bar, .print-page .poll .result, .print-page .poll .status { display: none; }

@media print {
  html, body, #app { height: auto; }
  body, .print-root { background: #fff; }
  .print-bar, .print-tip { display: none; }
  .print-page { margin: 0; box-shadow: none; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>
