<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { chapters } from '../lib/deck'
import { isOptional, lite } from '../lib/route'
import { units } from '../lib/units'
import Icon from './Icon.vue'

const props = defineProps<{ current: string, index: number }>()
const emit = defineEmits<{ close: [], go: [ch: string, i: number] }>()

const expanded = ref(props.current)
const root = ref<HTMLElement>()

// on the lite route optional chapters are hidden, except the one being viewed
const visible = computed(() => chapters.filter(c => !lite.value || !isOptional(c.num) || c.id === props.current))
const groups = computed(() => units.map(u => ({ ...u, chapters: visible.value.filter(c => c.num >= u.from && c.num <= u.to) })).filter(g => g.chapters.length))

onMounted(async () => {
  await nextTick()
  root.value?.querySelector('.here')?.scrollIntoView({ block: 'center' })
  root.value?.focus()
})
</script>

<template>
  <div class="overlay" @click.self="emit('close')" @keydown.esc.stop="emit('close')">
    <aside ref="root" class="sidebar" tabindex="-1" aria-label="章節目錄">
      <header>
        <strong>課程目錄<small v-if="lite">精簡路線</small></strong>
        <button class="btn square" aria-label="關閉目錄" @click="emit('close')"><Icon name="x" /></button>
      </header>
      <nav>
        <section v-for="(g, gi) in groups" :key="g.title" :class="`u-${g.color}`">
          <h3><span>第 {{ gi + 1 }} 單元</span>{{ g.title }}</h3>
          <div v-for="c in g.chapters" :key="c.id" class="chapter" :class="{ open: expanded === c.id }">
            <button class="chapter-row focusable" :class="{ current: c.id === current }" :aria-expanded="expanded === c.id" @click="expanded = expanded === c.id ? '' : c.id">
              <span class="num">{{ c.num }}</span>
              <span class="name">{{ c.title }}<em v-if="isOptional(c.num)" class="opt">選修</em></span>
              <span class="count">{{ c.count }} 頁</span>
            </button>
            <ol v-if="expanded === c.id" class="outline">
              <li v-for="(o, i) in c.outline" :key="i">
                <button
                  class="focusable" :class="{ section: o.l === 'section', here: c.id === current && i === index }"
                  @click="emit('go', c.id, i)"
                >
                  <span class="page">{{ i + 1 }}</span>{{ o.t || '（無標題）' }}
                </button>
              </li>
            </ol>
          </div>
        </section>
      </nav>
    </aside>
  </div>
</template>

<style scoped>
.sidebar { display: flex; flex-direction: column; width: min(380px, 92vw); height: 100%; background: var(--c-snow); border-right: 2px solid var(--c-line); outline: 0; animation: slide-in .18s ease-out; }
@keyframes slide-in { from { transform: translateX(-24px); opacity: 0; } }
header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 14px 20px; border-bottom: 2px solid var(--c-line); font-size: 19px; font-weight: 900; }
header small { margin-left: 8px; padding: 2px 8px; border-radius: 999px; background: var(--c-brand); color: #fff; font-size: 12px; font-weight: 900; vertical-align: middle; }
.opt { margin-left: 6px; padding: 0 6px; border-radius: 6px; border: 1.5px solid var(--c-line); color: var(--c-muted); font-size: 11px; font-weight: 900; font-style: normal; }
nav { flex: 1; overflow-y: auto; padding: 8px 12px 24px; }
h3 { display: flex; flex-direction: column; margin: 16px 0 8px; padding: 10px 14px; border-radius: 14px; background: var(--u); color: #fff; font-size: 16px; font-weight: 900; }
h3 span { font-size: 11px; letter-spacing: .1em; opacity: .9; }
.chapter-row { display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 10px; border-radius: 12px; background: none; border: 0; text-align: left; cursor: pointer; font-weight: 800; font-size: 15px; color: var(--c-ink); }
.chapter-row:hover { background: var(--c-polar); }
.chapter-row.current { background: var(--u-soft); }
.num { flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: var(--u-soft); color: var(--u-dark); font-size: 13px; font-weight: 900; }
.chapter-row.current .num { background: var(--u); color: #fff; }
.name { flex: 1; min-width: 0; }
.count { flex: none; color: var(--c-muted); font-size: 12px; }
.outline { margin: 2px 0 8px 24px; padding-left: 10px; border-left: 2px solid var(--c-line); list-style: none; }
.outline button { display: flex; gap: 8px; width: 100%; padding: 5px 8px; border: 0; border-radius: 9px; background: none; text-align: left; cursor: pointer; color: var(--c-ink-soft); font-size: 13.5px; font-weight: 600; line-height: 1.45; }
.outline button:hover { background: var(--c-polar); }
.outline button.section { margin-top: 6px; color: var(--c-ink); font-weight: 900; }
.outline button.here { background: var(--c-blue-soft); color: var(--c-blue-dark); font-weight: 800; }
.page { flex: none; width: 26px; color: var(--c-muted); font-size: 12px; font-weight: 800; text-align: right; }
</style>
