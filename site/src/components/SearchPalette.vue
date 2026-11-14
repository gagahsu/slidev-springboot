<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { chapterById } from '../lib/deck'
import Icon from './Icon.vue'

const emit = defineEmits<{ close: [] }>()
const router = useRouter()

type Doc = { c: string, i: number, t: string, x: string, lt?: string, lx?: string }
const docs = ref<Doc[] | null>(null)
const query = ref('')
const active = ref(0)
const input = ref<HTMLInputElement>()
const list = ref<HTMLElement>()
const MAX = 40

onMounted(async () => {
  input.value?.focus()
  const mod = await import('virtual:deck-search')
  docs.value = mod.default.map(d => ({ ...d, lt: d.t.toLowerCase(), lx: d.x.toLowerCase() }))
})

const terms = computed(() => query.value.toLowerCase().split(/\s+/).filter(Boolean))

const results = computed(() => {
  const ts = terms.value
  if (!docs.value || !ts.length) return { total: 0, items: [] as { doc: Doc, parts: { text: string, hit: boolean }[] }[] }
  const scored: { doc: Doc, score: number }[] = []
  for (const doc of docs.value) {
    let score = 0
    for (const t of ts) {
      const inTitle = doc.lt!.includes(t)
      const inBody = doc.lx!.includes(t)
      if (!inTitle && !inBody) { score = 0; break }
      score += (inTitle ? 10 : 0) + (inBody ? 1 : 0)
    }
    if (score) scored.push({ doc, score })
  }
  scored.sort((a, b) => b.score - a.score)
  return {
    total: scored.length,
    items: scored.slice(0, MAX).map(({ doc }) => ({ doc, parts: snippet(doc, ts) })),
  }
})

function snippet(doc: Doc, ts: string[]) {
  const lower = doc.lx!
  let pos = -1
  for (const t of ts) {
    const p = lower.indexOf(t)
    if (p >= 0 && (pos < 0 || p < pos)) pos = p
  }
  const start = Math.max(0, pos - 24)
  const text = (start > 0 ? '…' : '') + doc.x.slice(start, start + 110) + (start + 110 < doc.x.length ? '…' : '')
  const re = new RegExp(`(${ts.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  return text.split(re).filter(Boolean).map(s => ({ text: s, hit: ts.includes(s.toLowerCase()) }))
}

watch(query, () => { active.value = 0 })
watch(active, async () => {
  await nextTick()
  list.value?.querySelector('.active')?.scrollIntoView({ block: 'nearest' })
})

function open(doc: Doc) {
  router.push(`/${doc.c}/${doc.i + 1}`)
  emit('close')
}
function onKey(e: KeyboardEvent) {
  const n = results.value.items.length
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowDown') { e.preventDefault(); active.value = n ? (active.value + 1) % n : 0 }
  else if (e.key === 'ArrowUp') { e.preventDefault(); active.value = n ? (active.value - 1 + n) % n : 0 }
  else if (e.key === 'Enter' && !e.isComposing && n) open(results.value.items[active.value].doc)
  e.stopPropagation()
}
</script>

<template>
  <div class="overlay search-overlay" @click.self="emit('close')" @keydown="onKey">
    <div class="palette" role="dialog" aria-label="搜尋教材">
      <div class="field">
        <Icon name="search" />
        <input ref="input" v-model="query" type="text" placeholder="搜尋全部章節，例如 @Autowired、交易、JWT" aria-label="搜尋關鍵字">
        <kbd>Esc</kbd>
      </div>
      <div ref="list" class="results">
        <p v-if="!docs" class="hint">載入搜尋索引中…</p>
        <p v-else-if="!terms.length" class="hint">輸入關鍵字，可用空白分隔多個詞。<kbd>↑</kbd> <kbd>↓</kbd> 選擇，<kbd>Enter</kbd> 前往。</p>
        <p v-else-if="!results.total" class="hint">找不到「{{ query }}」，換個關鍵字試試。</p>
        <template v-else>
          <button
            v-for="(r, n) in results.items" :key="`${r.doc.c}-${r.doc.i}`"
            class="result" :class="{ active: n === active }" @click="open(r.doc)" @mousemove="active = n"
          >
            <span class="where">Ch {{ chapterById(r.doc.c)?.num }} · 第 {{ r.doc.i + 1 }} 頁</span>
            <span class="title">{{ r.doc.t || chapterById(r.doc.c)?.title }}</span>
            <span class="snip"><template v-for="(p, k) in r.parts" :key="k"><mark v-if="p.hit">{{ p.text }}</mark><template v-else>{{ p.text }}</template></template></span>
          </button>
          <p v-if="results.total > results.items.length" class="hint">共 {{ results.total }} 筆，僅顯示前 {{ results.items.length }} 筆。再多打幾個字可以縮小範圍。</p>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-overlay { z-index: 80; display: flex; justify-content: center; align-items: flex-start; padding: 9vh 16px 16px; }
.palette { display: flex; flex-direction: column; width: min(680px, 100%); max-height: 78vh; border: 2px solid var(--c-line); border-radius: 20px; background: var(--c-snow); overflow: hidden; }
.field { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-bottom: 2px solid var(--c-line); color: var(--c-muted); font-size: 18px; }
.field input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--c-ink); font: 700 18px var(--font-sans); }
.field input::placeholder { color: var(--c-muted); }
.results { overflow-y: auto; padding: 8px; }
.hint { margin: 0; padding: 18px 12px; color: var(--c-ink-soft); font-weight: 700; font-size: 14px; line-height: 2; }
.result { display: grid; grid-template-columns: 1fr; gap: 2px; width: 100%; padding: 10px 14px; border: 2px solid transparent; border-radius: 14px; background: none; text-align: left; cursor: pointer; }
.result.active { border-color: #84d8ff; background: var(--c-blue-soft); }
.where { color: var(--c-blue-dark); font-size: 12px; font-weight: 800; letter-spacing: .04em; }
.title { color: #2b2b2b; font-size: 16px; font-weight: 800; }
.snip { color: var(--c-ink-soft); font-size: 13.5px; line-height: 1.5; overflow-wrap: anywhere; }
.snip mark { border-radius: 4px; background: #ffe58a; color: inherit; padding: 0 1px; }
</style>
