<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from '../components/Icon.vue'
import Overview from '../components/Overview.vue'
import Sidebar from '../components/Sidebar.vue'
import SlideCanvas from '../components/SlideCanvas.vue'
import { chapterAt, chapterById, loadChapter, type Slide } from '../lib/deck'
import { visit } from '../lib/progress'
import { unitOf } from '../lib/units'

const route = useRoute()
const router = useRouter()
const openSearch = inject<() => void>('openSearch')!

const chId = computed(() => String(route.params.ch))
const chapter = computed(() => chapterById(chId.value))
const slides = shallowRef<Slide[]>([])
const loading = ref(true)
const index = computed(() => {
  const n = Number(route.params.n || 1) - 1
  const max = Math.max(0, (chapter.value?.count ?? 1) - 1)
  return Math.min(Math.max(0, Number.isFinite(n) ? n : 0), max)
})
const slide = computed(() => slides.value[index.value])
const unit = computed(() => unitOf(chapter.value?.num ?? 1))
const nextChapter = computed(() => chapterAt(1, chId.value))
const prevChapter = computed(() => chapterAt(-1, chId.value))
const atEnd = computed(() => index.value >= slides.value.length - 1)

const sidebar = ref(false)
const overview = ref(false)
const immersive = ref(false)

watch(chId, async (id) => {
  if (!chapterById(id)) { router.replace('/'); return }
  loading.value = true
  const loaded = await loadChapter(id)
  if (id !== chId.value) return
  slides.value = loaded
  loading.value = false
}, { immediate: true })

watch([chId, index, chapter], () => {
  if (!chapter.value) return
  visit(chId.value, index.value)
  document.title = `Ch ${chapter.value.num} ${chapter.value.title} · ${index.value + 1}/${chapter.value.count}`
}, { immediate: true })

function go(i: number, ch = chId.value) {
  sidebar.value = overview.value = false
  router.push(`/${ch}/${i + 1}`)
}
function next() {
  if (!atEnd.value) go(index.value + 1)
  else if (nextChapter.value) go(0, nextChapter.value.id)
}
function prev() {
  if (index.value > 0) go(index.value - 1)
  else if (prevChapter.value) go(prevChapter.value.count - 1, prevChapter.value.id)
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen()
  else document.documentElement.requestFullscreen?.().catch(() => { immersive.value = !immersive.value })
}
function onFullscreenChange() { immersive.value = !!document.fullscreenElement }

function onKey(e: KeyboardEvent) {
  const t = e.target as HTMLElement
  if (e.metaKey || e.ctrlKey || e.altKey || t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return
  if (e.key === 'Escape') {
    if (overview.value || sidebar.value) overview.value = sidebar.value = false
    else if (immersive.value && !document.fullscreenElement) immersive.value = false
    return
  }
  if (overview.value || sidebar.value) return
  switch (e.key) {
    case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter':
      if ((e.key === ' ' || e.key === 'Enter') && t.closest('button, a')) return
      e.preventDefault(); next(); break
    case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace':
      e.preventDefault(); prev(); break
    case 'Home': e.preventDefault(); go(0); break
    case 'End': e.preventDefault(); go(slides.value.length - 1); break
    case 'o': case 'O': overview.value = true; break
    case 't': case 'T': sidebar.value = true; break
    case 'f': case 'F': toggleFullscreen(); break
  }
}

// swipe on touch screens
let touchX = 0
let touchY = 0
function onTouchStart(e: TouchEvent) { touchX = e.touches[0].clientX; touchY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchX
  const dy = e.changedTouches[0].clientY - touchY
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) dx < 0 ? next() : prev()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<template>
  <div v-if="chapter" class="deck" :class="[`u-${unit.color}`, { immersive }]">
    <header class="bar top">
      <RouterLink class="btn square" to="/" aria-label="回到課程目錄" title="回到課程目錄"><Icon name="x" /></RouterLink>
      <div class="progress" role="progressbar" :aria-valuenow="index + 1" aria-valuemin="1" :aria-valuemax="chapter.count" :aria-label="`第 ${index + 1} 頁，共 ${chapter.count} 頁`">
        <i :style="{ width: `${(index + 1) / chapter.count * 100}%` }" />
      </div>
      <span class="counter">{{ index + 1 }} <small>/ {{ chapter.count }}</small></span>
    </header>

    <main class="stage" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
      <div class="frame">
        <SlideCanvas v-if="slide" :slide="slide" />
        <div v-else class="placeholder" :style="{ aspectRatio: '980 / 552' }">{{ loading ? '載入中…' : '這一章沒有投影片' }}</div>
      </div>
    </main>

    <footer class="bar bottom">
      <div class="tools">
        <button class="btn" title="章節目錄 (T)" @click="sidebar = true"><Icon name="menu" /><span>目錄</span></button>
        <button class="btn" title="投影片總覽 (O)" @click="overview = true"><Icon name="grid" /><span>總覽</span></button>
        <button class="btn" title="搜尋 (/)" @click="openSearch()"><Icon name="search" /><span>搜尋</span></button>
      </div>
      <div class="where">
        <small>Ch {{ chapter.num }} · {{ chapter.title }}</small>
        <strong>{{ slide?.title }}</strong>
      </div>
      <div class="nav">
        <button class="btn square" title="全螢幕 (F)" aria-label="全螢幕" @click="toggleFullscreen"><Icon name="expand" /></button>
        <button class="btn square" title="上一頁 (←)" aria-label="上一頁" :disabled="index === 0 && !prevChapter" @click="prev"><Icon name="left" /></button>
        <button class="btn primary" title="下一頁 (→)" :disabled="atEnd && !nextChapter" @click="next">
          <span>{{ atEnd && nextChapter ? '下一章' : '下一頁' }}</span><Icon name="right" />
        </button>
      </div>
    </footer>

    <div v-if="immersive" class="thin-progress"><i :style="{ width: `${(index + 1) / chapter.count * 100}%` }" /></div>

    <Sidebar v-if="sidebar" :current="chId" :index="index" @close="sidebar = false" @go="(ch, i) => go(i, ch)" />
    <Overview v-if="overview" :slides="slides" :index="index" :title="`Ch ${chapter.num} · ${chapter.title}`" @close="overview = false" @go="go" />
  </div>
</template>

<style scoped>
.deck { --bar-top: 70px; --bar-bottom: 82px; display: flex; flex-direction: column; height: 100%; background: var(--c-polar); }
.bar { flex: none; display: flex; align-items: center; gap: 16px; padding: 0 20px; background: var(--c-snow); }
.top { height: var(--bar-top); border-bottom: 2px solid var(--c-line); }
.bottom { height: var(--bar-bottom); border-top: 2px solid var(--c-line); justify-content: space-between; }

.progress { flex: 1; height: 18px; border-radius: 9px; background: var(--c-line); overflow: hidden; }
.progress i { position: relative; display: block; height: 100%; min-width: 18px; border-radius: 9px; background: var(--u); transition: width .25s ease; }
.progress i::after { content: ''; position: absolute; top: 4px; left: 8px; right: 8px; height: 4px; border-radius: 2px; background: rgba(255, 255, 255, .3); }
.counter { flex: none; min-width: 74px; text-align: right; color: var(--u-dark); font-size: 19px; font-weight: 900; font-variant-numeric: tabular-nums; }
.counter small { color: var(--c-muted); font-size: 14px; }

.stage { flex: 1; min-height: 0; display: grid; place-items: center; padding: 18px; }
.frame {
  width: min(100%, calc((100vh - var(--bar-top) - var(--bar-bottom) - 40px) * 980 / 552));
  border: 2px solid var(--c-line);
  border-radius: 18px;
  box-shadow: 0 4px 0 var(--c-line);
  background: var(--c-snow);
  overflow: hidden;
}
.placeholder { display: grid; place-items: center; color: var(--c-muted); font-weight: 800; }

.tools, .nav { display: flex; gap: 10px; flex: none; }
.where { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; text-align: center; }
.where small { color: var(--u-dark); font-size: 12px; font-weight: 900; letter-spacing: .04em; }
.where strong { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 15px; font-weight: 800; color: var(--c-ink); }
.where small { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* presentation (fullscreen) mode: slide only */
.immersive { background: var(--c-night); }
.immersive .bar { display: none; }
.immersive .stage { padding: 0; }
.immersive .frame { width: min(100vw, calc(100vh * 980 / 552)); border: 0; border-radius: 0; box-shadow: none; }
.thin-progress { position: fixed; left: 0; right: 0; bottom: 0; height: 4px; background: rgba(255, 255, 255, .12); }
.thin-progress i { display: block; height: 100%; background: var(--u); transition: width .25s ease; }

@media (max-width: 860px) {
  .tools .btn { width: 46px; padding: 0; }
  .tools .btn span, .where { display: none; }
  .bottom { gap: 8px; }
}
</style>
