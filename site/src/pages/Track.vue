<script setup lang="ts">
import { computed, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from '../components/Icon.vue'
import { chapterDone, itemsPct, nextUnfinished, trackById, trackChapters, trackStages, type TrackItem } from '../lib/track'

// One learning track (#/track/<id>): stages of chapters from several courses, in teaching order.
// Chapters open with ?track=<id> so 「下一章」 follows the track across courses.
const route = useRoute()
const router = useRouter()
// the route guard only runs when entering the page, so also handle #/track/a → #/track/unknown
const found = computed(() => trackById(route.params.id))
watch(found, (t) => { if (!t && route.path.startsWith('/track/')) router.replace('/') }, { immediate: true })
// keep the last valid track while the page is being left, so the template never sees undefined
let last = found.value!
const track = computed(() => (last = found.value ?? last))
const stages = computed(() => trackStages(track.value))
const chapters = computed(() => trackChapters(track.value))
const soonCount = computed(() => stages.value.reduce((n, s) => n + s.items.filter(i => i.kind === 'soon').length, 0))
const slides = computed(() => chapters.value.reduce((n, i) => n + i.ch.count, 0))
const allItems = computed(() => stages.value.flatMap(s => s.items))
const pct = computed(() => itemsPct(allItems.value))

/** 「繼續學程」: first unfinished chapter, at the first slide not seen yet */
const resume = computed(() => {
  const i = nextUnfinished(track.value)
  if (!i) return null
  const done = chapterDone(i.course.id, i.ch)
  return { item: i, page: Math.min(done + 1, i.ch.count), started: done > 0 || pct.value > 0 }
})

const link = (i: Extract<TrackItem, { kind: 'chapter' }>, page = 1) => ({ path: `/${i.course.id}/${i.ch.id}/${page}`, query: { track: track.value.id } })
const chapterPct = (i: Extract<TrackItem, { kind: 'chapter' }>) => Math.round(chapterDone(i.course.id, i.ch) / i.ch.count * 100)

watchEffect(() => { document.title = track.value.title })
</script>

<template>
  <div class="home" :class="`u-${track.color}`">
    <header class="top">
      <RouterLink class="btn square" to="/" aria-label="回到首頁" title="回到首頁"><Icon name="left" /></RouterLink>
      <div class="brand">
        <span class="logo" aria-hidden="true">{{ track.logo }}</span>
        <div>
          <h1>{{ track.title }}</h1>
          <p>{{ stages.length }} 個階段 · {{ chapters.length }} 章 · {{ slides.toLocaleString() }} 張投影片<template v-if="soonCount"> · {{ soonCount }} 項準備中</template></p>
        </div>
      </div>
    </header>

    <main>
      <p class="intro">{{ track.description }}</p>
      <p v-if="track.project" class="project"><b>專題</b>{{ track.project }}</p>

      <div class="overall">
        <div class="bar big" role="progressbar" :aria-valuenow="pct" aria-valuemin="0" aria-valuemax="100" aria-label="學程進度"><i :style="{ width: `${pct}%` }" /></div>
        <span>{{ pct }}%</span>
        <RouterLink v-if="resume" class="btn primary" :to="link(resume.item, resume.page)">
          <Icon name="play" />{{ resume.started ? '繼續學程' : '開始學程' }}：{{ resume.item.course.short }} Ch {{ resume.item.ch.num }}
        </RouterLink>
      </div>

      <section v-for="(st, si) in stages" :key="si" class="stage">
        <div class="stage-head">
          <span class="step">{{ si + 1 }}</span>
          <div>
            <h2>{{ st.title }}</h2>
            <p>{{ st.desc }}</p>
          </div>
          <span class="stage-pct">{{ itemsPct(st.items) }}%</span>
        </div>
        <ol class="items">
          <li v-for="(it, ii) in st.items" :key="ii">
            <RouterLink v-if="it.kind === 'chapter'" class="item" :class="`u-${it.course.color}`" :to="link(it)">
              <span class="course">{{ it.course.short }}</span>
              <span class="num">{{ it.ch.num }}</span>
              <span class="name">{{ it.ch.title }}<small v-if="it.ch.subtitle">{{ it.ch.subtitle }}</small></span>
              <span class="meta">
                <span class="bar" role="progressbar" :aria-valuenow="chapterPct(it)" aria-valuemin="0" aria-valuemax="100"><i :style="{ width: `${chapterPct(it)}%` }" /></span>
                {{ it.ch.count }} 頁
              </span>
            </RouterLink>
            <div v-else class="item soon" :title="it.note || undefined">
              <span class="course">{{ it.course?.short ?? it.courseId ?? '' }}</span>
              <span class="num">…</span>
              <span class="name">{{ it.label }}<small v-if="it.note">{{ it.note }}</small></span>
              <span class="badge">準備中</span>
            </div>
          </li>
        </ol>
      </section>
    </main>
  </div>
</template>

<style scoped>
.home { min-height: 100%; background: var(--c-snow); }
.top { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; gap: 14px; padding: 14px max(20px, calc((100vw - 1080px) / 2)); border-bottom: 2px solid var(--c-line); background: var(--c-snow); }
.brand { display: flex; align-items: center; gap: 14px; min-width: 0; }
.logo { flex: none; display: grid; place-items: center; width: 46px; height: 46px; border-radius: 14px; background: var(--u); box-shadow: 0 4px 0 var(--u-dark); color: #fff; font-size: 22px; font-weight: 900; }
.brand h1 { margin: 0; font-size: 20px; font-weight: 900; line-height: 1.2; color: #2b2b2b; }
.brand p { margin: 2px 0 0; color: var(--c-muted); font-size: 13px; font-weight: 800; }

main { max-width: 1080px; margin: 0 auto; padding: 24px 20px 80px; }
.intro { margin: 0; color: var(--c-ink-soft); font-size: 15px; font-weight: 700; line-height: 1.6; }
.project { margin: 10px 0 0; color: var(--c-ink); font-size: 14px; font-weight: 800; }
.project b { margin-right: 8px; padding: 2px 8px; border-radius: 8px; background: var(--u); color: #fff; font-size: 12px; }
.overall { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-top: 20px; padding: 16px 20px; border: 2px solid var(--c-line); border-radius: 18px; box-shadow: 0 4px 0 var(--c-line); }
.overall > span { color: var(--c-muted); font-size: 14px; font-weight: 900; }
.overall .btn { margin-left: auto; background: var(--u); box-shadow: 0 4px 0 var(--u-dark); }
.bar { flex: 1; min-width: 60px; height: 8px; border-radius: 4px; background: var(--c-line); overflow: hidden; }
.bar.big { height: 12px; border-radius: 6px; min-width: 140px; }
.bar i { display: block; height: 100%; border-radius: inherit; background: var(--u); }

.stage { margin-top: 30px; }
.stage-head { display: flex; align-items: center; gap: 14px; }
.step { flex: none; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: var(--u); box-shadow: 0 3px 0 var(--u-dark); color: #fff; font-size: 18px; font-weight: 900; }
.stage-head h2 { margin: 0; font-size: 20px; font-weight: 900; color: #2b2b2b; }
.stage-head p { margin: 2px 0 0; color: var(--c-ink-soft); font-size: 14px; font-weight: 700; }
.stage-pct { margin-left: auto; color: var(--c-muted); font-size: 13px; font-weight: 900; }

.items { display: grid; gap: 8px; margin: 14px 0 0 19px; padding: 0 0 0 33px; border-left: 3px solid var(--c-line); list-style: none; }
.item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border: 2px solid var(--c-line); border-radius: 14px; background: var(--c-snow); transition: border-color .12s, transform .08s; }
a.item:hover { border-color: var(--u); transform: translateX(2px); }
a.item:focus-visible { outline: 3px solid var(--c-blue); outline-offset: 2px; }
.course { flex: none; width: 92px; padding: 2px 8px; border-radius: 8px; background: var(--u-soft); color: var(--u-dark); font-size: 12px; font-weight: 900; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.num { flex: none; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: var(--u); color: #fff; font-size: 14px; font-weight: 900; }
.name { flex: 1; min-width: 0; display: flex; flex-direction: column; color: #2b2b2b; font-size: 15px; font-weight: 800; }
.name small { color: var(--c-ink-soft); font-size: 12.5px; font-weight: 700; }
.meta { flex: none; display: flex; align-items: center; gap: 8px; width: 150px; color: var(--c-muted); font-size: 12px; font-weight: 800; }
.soon { border-style: dashed; background: var(--c-polar); }
.soon .course { background: var(--c-line); color: var(--c-ink-soft); }
.soon .num { background: var(--c-line); color: var(--c-muted); }
.soon .name { color: var(--c-ink-soft); }
.badge { flex: none; padding: 2px 10px; border-radius: 999px; border: 2px dashed var(--c-muted); color: var(--c-muted); font-size: 12px; font-weight: 900; }

@media (max-width: 640px) {
  .items { margin-left: 8px; padding-left: 14px; }
  .course, .meta { display: none; }
}
</style>
