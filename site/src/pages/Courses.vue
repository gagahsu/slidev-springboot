<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '../components/Icon.vue'
import { chapterById, courseById, courses, slideCount, tracks } from '../lib/deck'
import { itemsPct, trackChapters, trackStages } from '../lib/track'
import { courseProgress, progress } from '../lib/progress'
import { normalizeCode } from '../lib/room'
import { liveClass } from '../lib/settings'

// Site home: pick a course. Each course has its own home page at #/<course>.
const openSearch = inject<() => void>('openSearch')!
const router = useRouter()
const joining = ref(false)
const code = ref('')
function join() {
  const c = normalizeCode(code.value)
  if (c.length === 8) router.push(`/join/${c}`)
}
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

const resume = computed(() => {
  const last = progress.last
  const course = last && courseById(last.course)
  const ch = course && chapterById(course.id, last!.ch)
  return course && ch ? { course, ch, i: Math.min(last!.i, ch.count - 1) } : null
})

/** share of the course's slides reached */
function coursePct(id: string) {
  const c = courseById(id)!
  const seen = courseProgress(id).seen
  const done = c.chapters.reduce((n, ch) => n + Math.min(ch.count, (seen[ch.id] ?? -1) + 1), 0)
  return Math.round(done / Math.max(1, slideCount(c)) * 100)
}

const trackPct = (t: (typeof tracks)[number]) => itemsPct(trackStages(t).flatMap(s => s.items))
const trackSoon = (t: (typeof tracks)[number]) => trackStages(t).reduce((n, s) => n + s.items.filter(i => i.kind === 'soon').length, 0)

onMounted(() => { document.title = '課程總覽' })
</script>

<template>
  <div class="home">
    <header class="top">
      <div class="brand">
        <div>
          <h1>課程總覽</h1>
          <p><template v-if="tracks.length">{{ tracks.length }} 條學程 · </template>{{ courses.length }} 門課程</p>
        </div>
      </div>
      <form v-if="liveClass && joining" class="join" @submit.prevent="join">
        <input v-model="code" aria-label="課堂代碼" placeholder="課堂代碼（8 碼）" maxlength="9" autocapitalize="characters" autocomplete="off" autofocus>
        <button class="btn primary" type="submit" :disabled="normalizeCode(code).length !== 8">加入</button>
      </form>
      <button v-else-if="liveClass" class="btn" @click="joining = true"><Icon name="wifi" /><span>加入課堂</span></button>
      <button class="btn search" @click="openSearch()">
        <Icon name="search" /><span>搜尋全部課程</span><kbd>{{ isMac ? '⌘' : 'Ctrl' }} K</kbd>
      </button>
    </header>

    <main>
      <RouterLink v-if="resume" class="resume" :to="`/${resume.course.id}/${resume.ch.id}/${resume.i + 1}`">
        <div>
          <small>繼續上次的進度 · {{ resume.course.short }}</small>
          <strong>Ch {{ resume.ch.num }}　{{ resume.ch.title }}</strong>
          <span>第 {{ resume.i + 1 }} / {{ resume.ch.count }} 頁</span>
        </div>
        <span class="btn primary"><Icon name="play" />繼續</span>
      </RouterLink>

      <template v-if="tracks.length">
        <h2 class="section">學程<small>依順序跨課程上課，「下一章」會自動帶到學程裡的下一個章節</small></h2>
        <div class="tracks">
          <RouterLink v-for="t in tracks" :key="t.id" class="track-card" :class="`u-${t.color}`" :to="`/track/${t.id}`">
            <span class="logo" aria-hidden="true">{{ t.logo }}</span>
            <span class="body">
              <strong>{{ t.title }}</strong>
              <span class="desc">{{ t.description }}</span>
              <span class="meta">{{ t.stages.length }} 個階段 · {{ trackChapters(t).length }} 章<template v-if="trackSoon(t)"> · {{ trackSoon(t) }} 項準備中</template></span>
              <span class="foot">
                <span class="bar" role="progressbar" :aria-valuenow="trackPct(t)" aria-valuemin="0" aria-valuemax="100" :aria-label="`${t.title} 進度`"><i :style="{ width: `${trackPct(t)}%` }" /></span>
                <span class="pct">{{ trackPct(t) }}%</span>
                <span class="btn primary go">查看學程</span>
              </span>
            </span>
          </RouterLink>
        </div>
        <h2 class="section">所有課程<small>單獨查看某一門課的全部章節</small></h2>
      </template>
      <div class="courses">
        <RouterLink v-for="c in courses" :key="c.id" class="course-card" :class="`u-${c.color}`" :to="`/${c.id}`" :data-pdf="c.pdfName">
          <span class="logo" aria-hidden="true">{{ c.logo }}</span>
          <span class="body">
            <strong>{{ c.title }}</strong>
            <span class="desc">{{ c.description }}</span>
            <span class="meta">{{ c.chapters.length }} 章 · {{ slideCount(c).toLocaleString() }} 張投影片 · {{ c.units.length }} 個單元</span>
            <span class="foot">
              <span class="bar" role="progressbar" :aria-valuenow="coursePct(c.id)" aria-valuemin="0" aria-valuemax="100" :aria-label="`${c.short} 進度`"><i :style="{ width: `${coursePct(c.id)}%` }" /></span>
              <span class="pct">{{ coursePct(c.id) }}%</span>
              <span class="btn primary go">進入課程</span>
            </span>
          </span>
        </RouterLink>
      </div>
      <p v-if="!courses.length" class="empty">還沒有課程。在 courses/ 底下建立一個資料夾，放入 course.yaml 和章節 Markdown。</p>
    </main>
  </div>
</template>

<style scoped>
.home { min-height: 100%; background: var(--c-snow); }
.top { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px max(20px, calc((100vw - 1080px) / 2)); border-bottom: 2px solid var(--c-line); background: var(--c-snow); }
.brand { display: flex; align-items: center; gap: 14px; min-width: 0; margin-right: auto; }
.brand h1 { margin: 0; font-size: 22px; font-weight: 900; line-height: 1.2; color: #2b2b2b; }
.brand p { margin: 2px 0 0; color: var(--c-muted); font-size: 13px; font-weight: 800; }
.join { display: flex; gap: 8px; }
.join input { width: 190px; height: 46px; padding: 0 14px; border: 2px solid var(--c-line); border-radius: 14px; font: 800 16px var(--font-mono); letter-spacing: .06em; text-transform: uppercase; }
.join input:focus { outline: 3px solid var(--c-blue); outline-offset: 1px; }
.search { color: var(--c-muted); }
.search span { margin-right: 20px; }

main { max-width: 1080px; margin: 0 auto; padding: 24px 20px 80px; }
.resume { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 28px; padding: 18px 22px; border: 2px solid var(--c-line); border-radius: 20px; box-shadow: 0 4px 0 var(--c-line); }
.resume div { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.resume small { color: var(--c-blue-dark); font-size: 12px; font-weight: 900; letter-spacing: .08em; }
.resume strong { font-size: 19px; font-weight: 900; color: #2b2b2b; }
.resume span:not(.btn) { color: var(--c-ink-soft); font-size: 14px; font-weight: 700; }

.section { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; margin: 6px 0 14px; font-size: 18px; font-weight: 900; color: #2b2b2b; }
.section small { color: var(--c-muted); font-size: 13px; font-weight: 800; }
.tracks { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 460px), 1fr)); gap: 20px; margin-bottom: 34px; }
.track-card { display: flex; gap: 18px; padding: 22px; border: 2px solid var(--u); border-radius: 22px; box-shadow: 0 5px 0 var(--u-dark); background: var(--u-soft); transition: transform .08s, box-shadow .08s; }
.track-card:hover { transform: translateY(-2px); }
.track-card:active { transform: translateY(3px); box-shadow: 0 2px 0 var(--u-dark); }
.track-card:focus-visible { outline: 3px solid var(--c-blue); outline-offset: 3px; }
.track-card .logo { font-size: 30px; }
.courses { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 460px), 1fr)); gap: 20px; }
.course-card { display: flex; gap: 18px; padding: 22px; border: 2px solid var(--c-line); border-radius: 22px; box-shadow: 0 5px 0 var(--c-line); background: var(--c-snow); transition: transform .08s, box-shadow .08s, border-color .12s; }
.course-card:hover { border-color: var(--u); box-shadow: 0 5px 0 var(--u); transform: translateY(-2px); }
.course-card:active { transform: translateY(3px); box-shadow: 0 2px 0 var(--u); }
.course-card:focus-visible, .resume:focus-visible { outline: 3px solid var(--c-blue); outline-offset: 3px; }
.logo { flex: none; display: grid; place-items: center; width: 72px; height: 72px; border-radius: 20px; background: var(--u); box-shadow: 0 5px 0 var(--u-dark); color: #fff; font-size: 36px; font-weight: 900; }
.body { display: flex; flex-direction: column; flex: 1; min-width: 0; gap: 4px; }
.body strong { font-size: 21px; font-weight: 900; line-height: 1.3; color: #2b2b2b; }
.desc { color: var(--c-ink-soft); font-size: 14.5px; font-weight: 700; line-height: 1.55; }
.meta { color: var(--c-muted); font-size: 13px; font-weight: 800; }
.foot { display: flex; align-items: center; gap: 12px; margin-top: auto; padding-top: 14px; }
.bar { flex: 1; height: 12px; border-radius: 6px; background: var(--c-line); overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 6px; background: var(--u); }
.pct { color: var(--c-muted); font-size: 13px; font-weight: 900; }
.go { background: var(--u); box-shadow: 0 4px 0 var(--u-dark); }
.empty { color: var(--c-ink-soft); font-weight: 700; }

@media (max-width: 640px) {
  .search span, .search kbd { display: none; }
  .top { flex-wrap: wrap; }
  .join input { width: 150px; }
  .course-card, .track-card { flex-direction: column; }
}
</style>
