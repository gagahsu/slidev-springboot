<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '../components/Icon.vue'
import { chapterById, chapters } from '../lib/deck'
import { progress } from '../lib/progress'
import { normalizeCode } from '../lib/room'
import { routeChapters } from '../lib/route'
import { liveClass, settings } from '../lib/settings'
import { units } from '../lib/units'

const openSearch = inject<() => void>('openSearch')!
const router = useRouter()
const joining = ref(false)
const code = ref('')
function join() {
  const c = normalizeCode(code.value)
  if (c.length === 8) router.push(`/join/${c}`)
}
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

const groups = computed(() => units.map(u => ({ ...u, chapters: routeChapters.value.filter(c => c.num >= u.from && c.num <= u.to) })).filter(g => g.chapters.length))
const routeSlides = computed(() => routeChapters.value.reduce((n, c) => n + c.count, 0))

const resume = computed(() => {
  const last = progress.last
  const ch = last && chapterById(last.ch)
  return ch ? { ch, i: Math.min(last!.i, ch.count - 1) } : null
})

const pct = (id: string, count: number) => {
  const seen = progress.seen[id]
  return seen === undefined ? 0 : Math.round((seen + 1) / count * 100)
}

onMounted(() => { document.title = 'Spring Boot Backend Masterclass' })
</script>

<template>
  <div class="home">
    <header class="top">
      <div class="brand">
        <span class="logo" aria-hidden="true">S</span>
        <div>
          <h1>Spring Boot Backend Masterclass</h1>
          <p>{{ routeChapters.length }} 章 · {{ routeSlides.toLocaleString() }} 張投影片</p>
        </div>
      </div>
      <form v-if="liveClass && joining" class="join" @submit.prevent="join">
        <input v-model="code" aria-label="課堂代碼" placeholder="課堂代碼（8 碼）" maxlength="9" autocapitalize="characters" autocomplete="off" autofocus>
        <button class="btn primary" type="submit" :disabled="normalizeCode(code).length !== 8">加入</button>
      </form>
      <button v-else-if="liveClass" class="btn" @click="joining = true"><Icon name="wifi" /><span>加入課堂</span></button>
      <button class="btn search" @click="openSearch()">
        <Icon name="search" /><span>搜尋教材</span><kbd>{{ isMac ? '⌘' : 'Ctrl' }} K</kbd>
      </button>
    </header>

    <main>
      <RouterLink v-if="resume" class="resume" :to="`/${resume.ch.id}/${resume.i + 1}`">
        <div>
          <small>繼續上次的進度</small>
          <strong>Ch {{ resume.ch.num }}　{{ resume.ch.title }}</strong>
          <span>第 {{ resume.i + 1 }} / {{ resume.ch.count }} 頁</span>
        </div>
        <span class="btn primary"><Icon name="play" />繼續</span>
      </RouterLink>

      <div class="route">
        <div class="seg" role="radiogroup" aria-label="學習路線">
          <button role="radio" :aria-checked="settings.route === 'full'" :class="{ on: settings.route === 'full' }" @click="settings.route = 'full'">完整課程</button>
          <button role="radio" :aria-checked="settings.route === 'lite'" :class="{ on: settings.route === 'lite' }" @click="settings.route = 'lite'">精簡路線</button>
        </div>
        <p v-if="settings.route === 'lite'">只留下完成「動態問卷系統」後端需要的章節，略過 {{ chapters.length - routeChapters.length }} 章（@PostConstruct、AOP、MyBatis、SQL Injection、測試與日誌、排程、Cache、Spring Cloud）。章節編號不變，「下一章」會自動跳過略過的章節。</p>
        <p v-else>全部 {{ chapters.length }} 章。只想完成實戰專題的話，可以切換成精簡路線。</p>
      </div>

      <section v-for="(g, gi) in groups" :key="g.title" class="unit" :class="`u-${g.color}`">
        <div class="unit-head">
          <small>第 {{ gi + 1 }} 單元 · Ch {{ g.chapters[0].num }}{{ g.chapters.length > 1 ? `–${g.chapters[g.chapters.length - 1].num}` : '' }}</small>
          <h2>{{ g.title }}</h2>
          <p>{{ g.desc }}</p>
        </div>
        <div class="cards">
          <RouterLink v-for="c in g.chapters" :key="c.id" class="card" :to="`/${c.id}/1`">
            <span class="num">{{ c.num }}</span>
            <span class="body">
              <strong>{{ c.title }}</strong>
              <span class="sub">{{ c.subtitle }}</span>
              <span class="meta">
                <span class="bar" role="progressbar" :aria-valuenow="pct(c.id, c.count)" aria-valuemin="0" aria-valuemax="100"><i :style="{ width: `${pct(c.id, c.count)}%` }" /></span>
                <span>{{ c.count }} 頁</span>
              </span>
            </span>
          </RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.home { min-height: 100%; background: var(--c-snow); }
.top { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px max(20px, calc((100vw - 1080px) / 2)); border-bottom: 2px solid var(--c-line); background: var(--c-snow); }
.brand { display: flex; align-items: center; gap: 14px; min-width: 0; }
.logo { flex: none; display: grid; place-items: center; width: 46px; height: 46px; border-radius: 14px; background: var(--c-brand); box-shadow: 0 4px 0 var(--c-brand-dark); color: #fff; font-size: 26px; font-weight: 900; }
.brand h1 { margin: 0; font-size: 20px; font-weight: 900; line-height: 1.2; color: #2b2b2b; }
.brand p { margin: 2px 0 0; color: var(--c-muted); font-size: 13px; font-weight: 800; }
.brand { margin-right: auto; }
.join { display: flex; gap: 8px; }
.join input { width: 190px; height: 46px; padding: 0 14px; border: 2px solid var(--c-line); border-radius: 14px; font: 800 16px var(--font-mono); letter-spacing: .06em; text-transform: uppercase; }
.join input:focus { outline: 3px solid var(--c-blue); outline-offset: 1px; }
.search { color: var(--c-muted); }
.search span { margin-right: 20px; }

main { max-width: 1080px; margin: 0 auto; padding: 24px 20px 80px; }
.resume { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 22px; border: 2px solid var(--c-line); border-radius: 20px; box-shadow: 0 4px 0 var(--c-line); }
.resume div { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.resume small { color: var(--c-blue-dark); font-size: 12px; font-weight: 900; letter-spacing: .08em; }
.resume strong { font-size: 19px; font-weight: 900; color: #2b2b2b; }
.resume span:not(.btn) { color: var(--c-ink-soft); font-size: 14px; font-weight: 700; }

.route { margin-top: 24px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.route p { flex: 1; min-width: 240px; margin: 0; color: var(--c-ink-soft); font-size: 14px; font-weight: 700; line-height: 1.5; }
.seg { display: inline-flex; padding: 4px; border: 2px solid var(--c-line); border-radius: 14px; background: var(--c-snow); }
.seg button { padding: 8px 16px; border: 0; border-radius: 10px; background: transparent; color: var(--c-muted); font: inherit; font-size: 15px; font-weight: 900; cursor: pointer; }
.seg button.on { background: var(--c-brand); color: #fff; box-shadow: 0 3px 0 var(--c-brand-dark); }
.seg button:focus-visible { outline: 3px solid var(--c-blue); outline-offset: 2px; }
.unit { margin-top: 36px; }
.unit-head { padding: 18px 24px; border-radius: 18px; background: var(--u); box-shadow: 0 5px 0 var(--u-dark); color: #fff; }
.unit-head small { font-size: 12.5px; font-weight: 900; letter-spacing: .08em; opacity: .9; }
.unit-head h2 { margin: 2px 0; font-size: 25px; font-weight: 900; }
.unit-head p { margin: 0; font-size: 15px; font-weight: 700; opacity: .95; }

.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; margin-top: 22px; }
.card { display: flex; gap: 14px; padding: 14px 16px; border: 2px solid var(--c-line); border-radius: 18px; box-shadow: 0 4px 0 var(--c-line); background: var(--c-snow); transition: transform .08s, box-shadow .08s, border-color .12s; }
.card:hover { border-color: var(--u); box-shadow: 0 4px 0 var(--u); transform: translateY(-2px); }
.card:active { transform: translateY(3px); box-shadow: 0 1px 0 var(--u); }
.card:focus-visible, .resume:focus-visible { outline: 3px solid var(--c-blue); outline-offset: 3px; }
.num { flex: none; display: grid; place-items: center; width: 46px; height: 46px; border-radius: 50%; background: var(--u); box-shadow: 0 4px 0 var(--u-dark); color: #fff; font-size: 18px; font-weight: 900; }
.body { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.body strong { font-size: 16.5px; font-weight: 900; line-height: 1.35; color: #2b2b2b; }
.sub { margin-top: 2px; color: var(--c-ink-soft); font-size: 13px; font-weight: 700; line-height: 1.4; }
.meta { display: flex; align-items: center; gap: 10px; margin-top: auto; padding-top: 10px; color: var(--c-muted); font-size: 12px; font-weight: 800; white-space: nowrap; }
.bar { flex: 1; height: 10px; border-radius: 5px; background: var(--c-line); overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 5px; background: var(--u); }

@media (max-width: 640px) {
  .search span, .search kbd { display: none; }
  .top { flex-wrap: wrap; }
  .join input { width: 150px; }
  .brand h1 { font-size: 16px; }
}
</style>
