<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import DrawToolbar from '../components/DrawToolbar.vue'
import Icon from '../components/Icon.vue'
import Overview from '../components/Overview.vue'
import RoomPanel from '../components/RoomPanel.vue'
import Sidebar from '../components/Sidebar.vue'
import SlideCanvas from '../components/SlideCanvas.vue'
import { questions } from '../lib/classroom'
import { draw } from '../lib/draw'
import { leaveRoom, room } from '../lib/room'
import { liveClass, settings } from '../lib/settings'
import { audienceCount } from '../lib/sync'
import { useDeck } from '../lib/useDeck'

const deck = useDeck('presenter')
const { courseId, course, chId, chapter, slides, loading, index, slide, unit, nextChapter, prevChapter, atEnd, drawKey, step, stepTotal, stepShown, next, prev } = deck

const sidebar = ref(false)
const overview = ref(false)
const roomPanel = ref(false)
const tab = ref<'notes' | 'questions'>('notes')
const openQuestions = computed(() => questions.filter(q => !q.done).length)
watch(liveClass, (on) => {
  if (on) return
  tab.value = 'notes'
  roomPanel.value = false
  // switching interaction off also closes the room this device opened
  if (room.status === 'on' && room.canControl) leaveRoom()
}, { immediate: true })
const nextSlide = computed(() => slides.value[index.value + 1])

function go(i: number, ch = chId.value) {
  sidebar.value = overview.value = false
  deck.go(i, ch)
}

// ---- speaker notes ----
const NOTE_KEY = 'deck-note-size'
const noteSize = ref(20)
try { noteSize.value = Number(localStorage.getItem(NOTE_KEY)) || 20 }
catch {}
watch(noteSize, (v) => {
  try { localStorage.setItem(NOTE_KEY, String(v)) }
  catch {}
})
const resize = (d: number) => { noteSize.value = Math.min(40, Math.max(14, noteSize.value + d)) }

/** notes are plain text with optional `inline code`; paragraphs are separated by blank lines */
const noteParagraphs = computed(() => (slide.value?.note ?? '')
  .split(/\n\s*\n/)
  .map(p => p.trim())
  .filter(Boolean)
  .map(p => p.split(/(`[^`\n]+`)/).filter(Boolean).map(seg => seg.startsWith('`') && seg.endsWith('`') && seg.length > 2
    ? { code: true, text: seg.slice(1, -1) }
    : { code: false, text: seg.replace(/\*\*/g, '') })))
const notesBox = ref<HTMLElement>()
watch(slide, () => { notesBox.value?.scrollTo({ top: 0 }) })

// ---- timer & clock ----
const elapsed = ref(0)
const running = ref(true)
const now = ref(new Date())
let last = Date.now()
let tick: ReturnType<typeof setInterval> | undefined
const two = (n: number) => String(n).padStart(2, '0')
const elapsedText = computed(() => {
  const s = Math.floor(elapsed.value / 1000)
  const h = Math.floor(s / 3600)
  return `${h ? `${h}:` : ''}${two(Math.floor(s / 60) % 60)}:${two(s % 60)}`
})
const clockText = computed(() => `${two(now.value.getHours())}:${two(now.value.getMinutes())}`)

// ---- audience window ----
const blocked = ref(false)
function openAudience() {
  const url = `${location.pathname}${location.search}#/${courseId.value}/${chId.value}/${index.value + 1}`
  const w = window.open(url, 'deck-audience', 'popup,width=1280,height=760')
  blocked.value = !w
}

function onKey(e: KeyboardEvent) {
  const t = e.target as HTMLElement
  if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return
  if (e.key === 'Escape') {
    if (overview.value || sidebar.value || roomPanel.value) overview.value = sidebar.value = roomPanel.value = false
    else draw.tool = 'none'
    return
  }
  if (overview.value || sidebar.value || roomPanel.value) return
  if (deck.handleKey(e)) return
  if (e.metaKey || e.ctrlKey || e.altKey) return
  switch (e.key) {
    case 'o': case 'O': overview.value = true; break
    case 't': case 'T': sidebar.value = true; break
    case '+': case '=': resize(2); break
    case '-': resize(-2); break
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  tick = setInterval(() => {
    const t = Date.now()
    if (running.value) elapsed.value += t - last
    last = t
    now.value = new Date()
  }, 500)
})
onBeforeUnmount(() => {
  draw.tool = 'none'
  window.removeEventListener('keydown', onKey)
  clearInterval(tick)
})
</script>

<template>
  <div v-if="chapter" class="presenter" :class="`u-${unit.color}`">
    <header class="top">
      <RouterLink class="pbtn" :to="`/${courseId}/${chId}/${index + 1}`" title="離開講師模式"><Icon name="x" /><span>離開</span></RouterLink>
      <div class="title">
        <small>講師模式 · {{ course?.short }} · Ch {{ chapter.num }}</small>
        <strong>{{ chapter.title }}</strong>
      </div>
      <div class="status" :class="{ ok: audienceCount > 0 }" role="status">
        <i />{{ audienceCount > 0 ? `已連線 ${audienceCount} 個展示視窗` : '尚未開啟展示視窗' }}
      </div>
      <button
        class="pbtn switch" role="switch" :aria-checked="settings.interactive" :class="{ on: settings.interactive }"
        :title="settings.interactive ? '課堂互動已開啟：學生可以投票、提問、用代碼加入' : '課堂互動已關閉：投票題顯示為「想一想」小測驗（適合錄影）'"
        @click="settings.interactive = !settings.interactive"
      >
        <i class="knob" aria-hidden="true" /><span>課堂互動</span>
      </button>
      <button v-if="liveClass" class="pbtn" :class="{ live: room.status === 'on' }" @click="roomPanel = true">
        <Icon name="wifi" /><span>{{ room.status === 'on' ? `課堂 ${room.people} 人` : '遠端課堂' }}</span>
      </button>
      <button class="pbtn accent" @click="openAudience"><Icon name="window" /><span>開啟展示視窗</span></button>
      <div class="timer" :class="{ paused: !running }">
        <span class="time" aria-label="已經過時間">{{ elapsedText }}</span>
        <button class="pbtn icon" :title="running ? '暫停計時' : '繼續計時'" :aria-label="running ? '暫停計時' : '繼續計時'" @click="running = !running"><Icon :name="running ? 'pause' : 'play'" /></button>
        <button class="pbtn icon" title="計時歸零" aria-label="計時歸零" @click="elapsed = 0"><Icon name="reset" /></button>
      </div>
      <span class="clock" aria-label="現在時間">{{ clockText }}</span>
    </header>
    <p v-if="blocked" class="blocked" role="alert">瀏覽器擋住了彈出視窗。請允許這個網站開啟彈出視窗，或自己開一個新分頁到同一頁，兩邊會自動同步。</p>

    <main>
      <section class="current">
        <div class="label">目前 <b>{{ index + 1 }}</b> / {{ chapter.count }}<span v-if="stepTotal" class="steps">動畫步驟 {{ stepShown }} / {{ stepTotal }}</span></div>
        <div class="frame">
          <SlideCanvas v-if="slide" :slide="slide" :draw-key="drawKey" :step="step" @steps="stepTotal = $event" />
          <div v-else class="placeholder">{{ loading ? '載入中…' : '' }}</div>
        </div>
        <div class="dock"><DrawToolbar :slide-key="drawKey" /></div>
      </section>

      <aside>
        <section class="next">
          <div class="label">下一張</div>
          <div class="frame small">
            <SlideCanvas v-if="nextSlide" :slide="nextSlide" />
            <div v-else class="placeholder">
              <template v-if="nextChapter">本章結束<br>下一章：Ch {{ nextChapter.num }} {{ nextChapter.title }}</template>
              <template v-else>課程結束</template>
            </div>
          </div>
        </section>
        <section class="notes">
          <div class="label">
            <span class="tabs" role="tablist">
              <button role="tab" :aria-selected="tab === 'notes'" :class="{ on: tab === 'notes' }" @click="tab = 'notes'">講稿</button>
              <button v-if="liveClass" role="tab" :aria-selected="tab === 'questions'" :class="{ on: tab === 'questions' }" @click="tab = 'questions'">
                學生提問<i v-if="openQuestions">{{ openQuestions }}</i>
              </button>
            </span>
            <span class="sizer">
              <button class="pbtn icon" title="縮小講稿字級 (-)" aria-label="縮小講稿字級" @click="resize(-2)"><Icon name="minus" /></button>
              <button class="pbtn icon" title="放大講稿字級 (+)" aria-label="放大講稿字級" @click="resize(2)"><Icon name="plus" /></button>
            </span>
          </div>
          <div v-if="tab === 'questions'" class="text questions" :style="{ fontSize: `${Math.max(16, noteSize - 2)}px` }" tabindex="0">
            <p v-if="!questions.length" class="empty">{{ room.status === 'on' ? '還沒有人提問。' : '開啟「遠端課堂」後，學生可以用手機匿名提問。' }}</p>
            <label v-for="q in questions" :key="q.id" class="q" :class="{ done: q.done }">
              <input v-model="q.done" type="checkbox" :aria-label="`標記已回答：${q.text}`">
              <span>{{ q.text }}</span>
            </label>
          </div>
          <div v-else ref="notesBox" class="text" :style="{ fontSize: `${noteSize}px` }" tabindex="0">
            <p v-for="(para, n) in noteParagraphs" :key="n"><template v-for="(seg, k) in para" :key="k"><code v-if="seg.code">{{ seg.text }}</code><template v-else>{{ seg.text }}</template></template></p>
            <p v-if="!noteParagraphs.length" class="empty">這一頁沒有講稿。</p>
          </div>
        </section>
      </aside>
    </main>

    <footer>
      <div class="side">
        <button class="pbtn" title="章節目錄 (T)" @click="sidebar = true"><Icon name="menu" /><span>目錄</span></button>
        <button class="pbtn" title="投影片總覽 (O)" @click="overview = true"><Icon name="grid" /><span>總覽</span></button>
      </div>
      <div class="where">{{ slide?.title }}</div>
      <div class="side">
        <button class="pbtn big" title="上一頁 (←)" :disabled="index === 0 && !prevChapter" @click="prev"><Icon name="left" /><span>上一頁</span></button>
        <button class="pbtn big primary" title="下一頁 (→)" :disabled="atEnd && !nextChapter && step >= stepTotal" @click="next"><span>{{ step < stepTotal ? '下一步' : atEnd && nextChapter ? '下一章' : '下一頁' }}</span><Icon name="right" /></button>
      </div>
    </footer>

    <RoomPanel v-if="roomPanel" @close="roomPanel = false" />
    <Sidebar v-if="sidebar" :current="chId" :index="index" @close="sidebar = false" @go="(ch, i) => go(i, ch)" />
    <Overview v-if="overview" :slides="slides" :index="index" :title="`Ch ${chapter.num} · ${chapter.title}`" :course-id="courseId" :chapter-id="chId" @close="overview = false" @go="go" />
  </div>
</template>

<style scoped>
.presenter { --panel: #1c2b33; --edge: #37464f; --text: #f1f7fb; --dim: #8fa3ad; display: flex; flex-direction: column; height: 100%; background: var(--c-night); color: var(--text); }
.top, footer { flex: none; display: flex; align-items: center; gap: 14px; padding: 10px 18px; }
.top { border-bottom: 2px solid var(--edge); }
footer { border-top: 2px solid var(--edge); justify-content: space-between; }
.title { display: flex; flex-direction: column; min-width: 0; margin-right: auto; }
.title small { color: var(--u); font-size: 12px; font-weight: 900; letter-spacing: .06em; }
.title strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 17px; font-weight: 900; }
.status { display: flex; align-items: center; gap: 8px; color: var(--dim); font-size: 13.5px; font-weight: 800; white-space: nowrap; }
.status i { width: 10px; height: 10px; border-radius: 50%; background: #56666f; }
.status.ok { color: #9be35a; }
.status.ok i { background: var(--c-brand); }
.timer { display: flex; align-items: center; gap: 6px; padding: 4px 6px 4px 14px; border: 2px solid var(--edge); border-radius: 14px; }
.time { min-width: 70px; font-size: 24px; font-weight: 900; font-variant-numeric: tabular-nums; }
.timer.paused .time { color: var(--dim); }
.clock { color: var(--dim); font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums; }
.blocked { margin: 0; padding: 8px 18px; background: #5a3a00; color: #ffd98a; font-size: 14px; font-weight: 700; }

.pbtn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 42px; padding: 0 14px; border: 2px solid var(--edge); border-radius: 13px; box-shadow: 0 3px 0 var(--edge); background: var(--panel); color: var(--text); font: 800 14.5px/1 var(--font-sans); white-space: nowrap; cursor: pointer; transition: transform .06s, box-shadow .06s; }
.pbtn:hover:not(:disabled) { background: #24363f; }
.pbtn:active:not(:disabled) { transform: translateY(3px); box-shadow: none; }
.pbtn:disabled { opacity: .4; cursor: default; }
.pbtn:focus-visible { outline: 3px solid var(--c-blue); outline-offset: 2px; }
.pbtn.icon { width: 36px; height: 36px; padding: 0; border-radius: 11px; box-shadow: none; }
.pbtn.accent { border-color: var(--c-blue-dark); box-shadow: 0 3px 0 var(--c-blue-dark); background: var(--c-blue); color: #fff; }
.pbtn.accent:hover { background: #3fbdf8; }
.pbtn.big { height: 50px; padding: 0 20px; font-size: 16px; }
.pbtn.primary { border-color: transparent; box-shadow: 0 4px 0 var(--c-brand-dark); background: var(--c-brand); color: #fff; }
.pbtn.primary:hover:not(:disabled) { background: #61e002; }

main { flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 18px; padding: 14px 18px; }
.current { display: flex; flex-direction: column; min-height: 0; }
aside { display: flex; flex-direction: column; gap: 14px; min-height: 0; }
.label { display: flex; align-items: center; justify-content: space-between; min-height: 30px; margin-bottom: 6px; color: var(--dim); font-size: 13px; font-weight: 900; letter-spacing: .08em; }
.label b { color: var(--text); font-size: 16px; }
.current .label { justify-content: flex-start; gap: 6px; }
.steps { margin-left: 12px; padding: 2px 10px; border-radius: 999px; background: var(--c-blue); color: #fff; letter-spacing: .02em; }
.frame { border: 2px solid var(--edge); border-radius: 14px; background: var(--c-snow); overflow: hidden; }
.current .frame { width: min(100%, calc((100vh - 300px) * 980 / 552)); }
.frame.small { width: min(100%, 420px); }
.placeholder { display: grid; place-items: center; aspect-ratio: 980 / 552; background: var(--panel); color: var(--dim); font-weight: 800; text-align: center; line-height: 1.8; }
.dock { margin-top: 12px; }
.notes { flex: 1; min-height: 0; display: flex; flex-direction: column; }
.sizer { display: flex; gap: 6px; }
.pbtn.switch { gap: 10px; color: var(--muted, #9aa5ad); }
.pbtn.switch .knob { position: relative; width: 34px; height: 20px; border-radius: 999px; background: var(--edge); transition: background .15s; }
.pbtn.switch .knob::after { content: ''; position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform .15s; }
.pbtn.switch.on { color: var(--text); }
.pbtn.switch.on .knob { background: var(--c-brand); }
.pbtn.switch.on .knob::after { transform: translateX(14px); }
.pbtn.live { border-color: var(--c-brand-dark); box-shadow: 0 3px 0 var(--c-brand-dark); color: #9be35a; }
.tabs { display: flex; gap: 6px; }
.tabs button { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border: 0; border-radius: 10px; background: none; color: var(--dim); font: 900 13px var(--font-sans); letter-spacing: .08em; cursor: pointer; }
.tabs button.on { background: var(--panel); color: var(--text); box-shadow: inset 0 0 0 2px var(--edge); }
.tabs button:focus-visible { outline: 3px solid var(--c-blue); }
.tabs i { min-width: 20px; padding: 0 6px; border-radius: 999px; background: #ff4b4b; color: #fff; font-style: normal; font-size: 12px; letter-spacing: 0; }
.q { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 2px solid var(--edge); cursor: pointer; }
.q input { flex: none; width: 20px; height: 20px; margin-top: .35em; accent-color: var(--c-brand); }
.q.done span { color: var(--dim); text-decoration: line-through; }
.text { flex: 1; overflow-y: auto; padding: 14px 18px; border: 2px solid var(--edge); border-radius: 14px; background: var(--panel); line-height: 1.75; font-weight: 600; }
.text p { margin: 0 0 .8em; }
.text code { padding: 0 6px; border-radius: 6px; background: #2f424c; color: #8fdcff; font: 700 .9em var(--font-mono); }
.text .empty { color: var(--dim); }
.side { display: flex; gap: 10px; }
.where { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center; color: var(--dim); font-size: 15px; font-weight: 800; }

@media (max-width: 900px) {
  .presenter { height: auto; min-height: 100%; }
  main { grid-template-columns: minmax(0, 1fr); }
  .dock { overflow-x: auto; }
  .current .frame { width: 100%; }
  .status, .clock, .where, .title { display: none; }
  .top { flex-wrap: wrap; }
  .notes { min-height: 240px; }
  .pbtn.big span { display: none; }
}
</style>
