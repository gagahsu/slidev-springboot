<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DrawToolbar from '../components/DrawToolbar.vue'
import Icon from '../components/Icon.vue'
import Overview from '../components/Overview.vue'
import Sidebar from '../components/Sidebar.vue'
import SlideCanvas from '../components/SlideCanvas.vue'
import { draw } from '../lib/draw'
import { linked } from '../lib/sync'
import { useDeck } from '../lib/useDeck'

const router = useRouter()
const openSearch = inject<() => void>('openSearch')!
const deck = useDeck('audience')
const { chId, chapter, slides, loading, index, slide, unit, nextChapter, prevChapter, atEnd, drawKey, step, stepTotal, stepShown, next, prev } = deck

const sidebar = ref(false)
const overview = ref(false)
const immersive = ref(false)
const drawing = ref(false)

function go(i: number, ch = chId.value) {
  sidebar.value = overview.value = false
  deck.go(i, ch)
}
function toggleDrawing(force?: boolean) {
  drawing.value = force ?? !drawing.value
  draw.tool = drawing.value ? 'pen' : 'none'
}
function present() {
  router.push(`/presenter/${chId.value}/${index.value + 1}`)
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen()
  else document.documentElement.requestFullscreen?.().catch(() => { immersive.value = !immersive.value })
}
function onFullscreenChange() { immersive.value = !!document.fullscreenElement }

function onKey(e: KeyboardEvent) {
  const t = e.target as HTMLElement
  if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return
  if (e.key === 'Escape') {
    if (overview.value || sidebar.value) overview.value = sidebar.value = false
    else if (drawing.value || draw.tool !== 'none') toggleDrawing(false)
    else if (immersive.value && !document.fullscreenElement) immersive.value = false
    return
  }
  if (overview.value || sidebar.value) return
  if (deck.handleKey(e)) {
    // a drawing shortcut opens the toolbar so the active tool is visible
    if (draw.tool !== 'none') drawing.value = true
    return
  }
  if (e.metaKey || e.ctrlKey || e.altKey) return
  switch (e.key) {
    case 'o': case 'O': overview.value = true; break
    case 't': case 'T': sidebar.value = true; break
    case 'f': case 'F': toggleFullscreen(); break
    case 'p': case 'P': present(); break
  }
}

// swipe on touch screens
let touchX = 0
let touchY = 0
function onTouchStart(e: TouchEvent) { touchX = e.touches[0].clientX; touchY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) {
  if (draw.tool !== 'none') return
  const dx = e.changedTouches[0].clientX - touchX
  const dy = e.changedTouches[0].clientY - touchY
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) dx < 0 ? next() : prev()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})
onBeforeUnmount(() => {
  draw.tool = 'none'
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
        <SlideCanvas v-if="slide" :slide="slide" :draw-key="drawKey" :step="step" @steps="stepTotal = $event" />
        <div v-else class="placeholder" :style="{ aspectRatio: '980 / 552' }">{{ loading ? '載入中…' : '這一章沒有投影片' }}</div>
      </div>
    </main>

    <footer class="bar bottom">
      <div class="tools">
        <button class="btn" title="章節目錄 (T)" @click="sidebar = true"><Icon name="menu" /><span>目錄</span></button>
        <button class="btn" title="投影片總覽 (O)" @click="overview = true"><Icon name="grid" /><span>總覽</span></button>
        <button class="btn" title="搜尋 (/)" @click="openSearch()"><Icon name="search" /><span>搜尋</span></button>
        <button class="btn" :class="{ on: drawing }" title="畫圖工具 (D)" :aria-pressed="drawing" @click="toggleDrawing()"><Icon name="pen" /><span>畫圖</span></button>
        <button class="btn" title="講師模式 (P)" @click="present"><Icon name="present" /><span>講師</span></button>
      </div>
      <div class="where">
        <small>Ch {{ chapter.num }} · {{ chapter.title }}<template v-if="linked"> · 已連線講師視窗</template></small>
        <strong>{{ slide?.title }}</strong>
      </div>
      <div class="nav">
        <button class="btn square" title="全螢幕 (F)" aria-label="全螢幕" @click="toggleFullscreen"><Icon name="expand" /></button>
        <button class="btn square" title="上一頁 (←)" aria-label="上一頁" :disabled="index === 0 && !prevChapter" @click="prev"><Icon name="left" /></button>
        <button class="btn primary" title="下一頁 (→)" :disabled="atEnd && !nextChapter && step >= stepTotal" @click="next">
          <span>{{ step < stepTotal ? '下一步' : atEnd && nextChapter ? '下一章' : '下一頁' }}</span><Icon name="right" />
        </button>
      </div>
    </footer>

    <div v-if="drawing" class="draw-dock"><DrawToolbar :slide-key="drawKey" /></div>

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

.btn.on { border-color: #84d8ff; box-shadow: 0 3px 0 #84d8ff; background: var(--c-blue-soft); color: var(--c-blue-dark); }
.draw-dock { position: fixed; left: 0; right: 0; bottom: calc(var(--bar-bottom) + 10px); z-index: 20; display: flex; justify-content: center; padding: 0 12px; pointer-events: none; }
.draw-dock > * { pointer-events: auto; }
.immersive .draw-dock { bottom: 14px; }

/* presentation (fullscreen) mode: slide only */
.immersive { background: var(--c-night); }
.immersive .bar { display: none; }
.immersive .stage { padding: 0; }
.immersive .frame { width: min(100vw, calc(100vh * 980 / 552)); border: 0; border-radius: 0; box-shadow: none; }
.thin-progress { position: fixed; left: 0; right: 0; bottom: 0; height: 4px; background: rgba(255, 255, 255, .12); }
.thin-progress i { display: block; height: 100%; background: var(--u); transition: width .25s ease; }

@media (max-width: 1100px) {
  .tools .btn { width: 46px; padding: 0; }
  .tools .btn span, .where { display: none; }
  .bottom { gap: 8px; }
}
</style>
