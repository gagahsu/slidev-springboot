<script setup lang="ts">
import { computed } from 'vue'
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch45 prototype: ONE scene that stays on screen while the story plays out step by step.
// Top: live meters (time of this request, trips to the file room, hits, notes on the desk).
// Middle: asker → desk (with the sticky-note board) → file room; a dot travels the path.
// Right: what changed in this step. `terms` adds the Spring names.
type Tone = 'add' | 'mod' | 'del' | 'note'
interface Note { key: number, val: number, st?: 'new' | 'hit' | 'torn' }
interface Frame {
  cap: string
  ask: string
  tag?: string
  trip?: 'miss' | 'hit'
  time: number | null
  room: number
  hit: number
  total: number
  notes: Note[]
  changed: [Tone, string][]
  bars?: boolean
}
defineProps<{ terms?: boolean }>()

const frames: Frame[] = [
  { cap: '放榜那天，櫃台上還沒有任何便利貼', ask: '「3 號的成績？」', time: null, room: 0, hit: 0, total: 0, notes: [], changed: [['note', '一開始：便利貼 0 張']] },
  { cap: '第一次問 3 號：沒有便利貼，只好進檔案室查，等了 300 ms', ask: '「3 號的成績？」', tag: 'Cache Miss', trip: 'miss', time: 300, room: 1, hit: 0, total: 1, notes: [], changed: [['mod', '這次花了 300 ms'], ['add', '檔案室 +1 次']] },
  { cap: '查到之後，順手抄一張「3 號：85」貼在櫃台', ask: '「3 號的成績？」', tag: '存入 Cache', time: 300, room: 1, hit: 0, total: 1, notes: [{ key: 3, val: 85, st: 'new' }], changed: [['add', '便利貼：3 號 → 85']] },
  { cap: '又有人問 3 號：看一眼便利貼就回答，只花 1 ms', ask: '「3 號的成績？」', tag: 'Cache Hit', trip: 'hit', time: 1, room: 1, hit: 1, total: 2, notes: [{ key: 3, val: 85, st: 'hit' }], changed: [['mod', '這次 300 → 1 ms'], ['note', '檔案室還是 1 次']] },
  { cap: '一整天 3 號被問了 100 次：只有第一次進了檔案室', ask: '「3 號的成績？」× 100', tag: 'Cache Hit × 99', trip: 'hit', time: 1, room: 1, hit: 99, total: 100, notes: [{ key: 3, val: 85, st: 'hit' }], changed: [['mod', '命中 99 / 100 次']], bars: true },
  { cap: '有人問 5 號：便利貼上沒有「5 號」，還是要去查一次', ask: '「5 號的成績？」', tag: 'Cache Miss', trip: 'miss', time: 300, room: 2, hit: 99, total: 101, notes: [{ key: 3, val: 85 }, { key: 5, val: 72, st: 'new' }], changed: [['add', '便利貼：5 號 → 72'], ['note', '每個編號（key）各一張']] },
  { cap: '3 號的成績改成 90 分：把「3 號」那張撕掉', ask: '「把 3 號改成 90」', tag: '@CacheEvict', time: null, room: 2, hit: 99, total: 101, notes: [{ key: 3, val: 85, st: 'torn' }, { key: 5, val: 72 }], changed: [['del', '撕掉 3 號（舊的 85）']] },
  { cap: '再問 3 號：沒有便利貼了，重新查到 90 分，再抄一張新的', ask: '「3 號的成績？」', tag: 'Cache Miss', trip: 'miss', time: 300, room: 3, hit: 99, total: 102, notes: [{ key: 3, val: 90, st: 'new' }, { key: 5, val: 72 }], changed: [['add', '檔案室 +1 次'], ['add', '便利貼：3 號 → 90（新的）']] },
]

const { local, live, animated } = useFixedSteps(frames.length - 1)
const idx = computed(() => live.value ? local.value : frames.length - 1)
const f = computed(() => frames[idx.value])
const prev = computed(() => idx.value > 0 ? frames[idx.value - 1] : null)
const bump = (k: 'time' | 'room' | 'hit') => live.value && !!prev.value && prev.value[k] !== f.value[k]
const kept = computed(() => f.value.notes.filter(n => n.st !== 'torn').length)
const bumpNotes = computed(() => live.value && !!prev.value && prev.value.notes.filter(n => n.st !== 'torn').length !== kept.value)
const mark: Record<Tone, string> = { add: '+', mod: '~', del: '−', note: '·' }
</script>

<template>
  <div class="anim-stage cache-trip">
    <div class="meters">
      <div class="m" :class="{ bump: bump('time'), slow: f.time === 300, fast: f.time === 1 }" :key="'t' + idx">
        <small>這次花了</small><b>{{ f.time === null ? '—' : f.time + ' ms' }}</b>
      </div>
      <div class="m" :class="{ bump: bump('room') }" :key="'r' + idx">
        <small>進檔案室{{ terms ? '（查資料庫）' : '' }}</small><b>{{ f.room }} 次</b>
      </div>
      <div class="m" :class="{ bump: bump('hit') }" :key="'h' + idx">
        <small>直接看便利貼{{ terms ? '（Hit）' : '' }}</small><b>{{ f.hit }} / {{ f.total }} 次</b>
      </div>
      <div class="m" :class="{ bump: bumpNotes }" :key="'n' + idx">
        <small>櫃台上的便利貼</small><b>{{ kept }} 張</b>
      </div>
    </div>

    <div class="scene">
      <div class="track" />
      <div v-if="animated() && f.trip" :key="'dot' + idx" class="dot" :class="f.trip" />

      <div class="actor ask">
        <Art :name="idx === 6 ? 'teacher' : 'you'" size="64" />
        <b>{{ f.ask }}</b>
        <em v-if="terms && f.tag" :class="{ evict: idx === 6, hit: f.trip === 'hit' }">{{ f.tag }}</em>
      </div>

      <div class="actor desk" :class="{ glow: f.trip === 'hit' }">
        <Art name="clerk" size="64" />
        <b>櫃台</b>
        <em v-if="terms" class="code">@Cacheable("students")</em>
      </div>

      <div class="board" :class="{ glow: f.trip === 'hit' }">
        <h4>便利貼<i v-if="terms">Cache：students</i></h4>
        <div class="notes">
          <span v-if="!f.notes.length" class="empty">（空的）</span>
          <div v-for="n in f.notes" :key="n.key + '-' + n.val" class="note" :class="n.st">
            <span>{{ n.key }} 號</span>{{ n.val }} 分
          </div>
        </div>
        <p v-if="terms" class="kv"><span>編號</span> = key　<span>分數</span> = value</p>
      </div>

      <div class="actor room" :class="{ busy: f.trip === 'miss', idle: f.trip === 'hit' }">
        <Art name="cabinet" size="64" />
        <b>檔案室</b>
        <small>{{ f.trip === 'hit' ? '沒有人來' : f.trip === 'miss' ? '翻找 300 ms' : '' }}</small>
        <em v-if="terms" class="code">MySQL</em>
      </div>
    </div>

    <aside class="changed">
      <h5>這一步改了什麼</h5>
      <ul>
        <li v-for="(c, i) in f.changed" :key="idx + '-' + i" :class="c[0]"><span>{{ mark[c[0]] }}</span>{{ c[1] }}</li>
      </ul>
      <div v-if="f.bars" class="bars">
        <p>問 100 次，總共要等多久？</p>
        <div class="bar no"><i style="width: 100%" /><span>沒有便利貼　30 秒</span></div>
        <div class="bar yes"><i style="width: 2%" /><span>有便利貼　0.4 秒</span></div>
      </div>
    </aside>

    <p class="caption"><span>{{ idx + 1 }}</span>{{ f.cap }}</p>
  </div>
</template>

<style>
.slide .anim-stage.cache-trip { height: 410px; }
.cache-trip i, .cache-trip em { font-style: normal; }

/* meters */
.cache-trip .meters { position: absolute; left: 0; right: 0; top: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.cache-trip .m { display: flex; flex-direction: column; gap: 2px; padding: 7px 12px; border: 2px solid #d7dde0; border-radius: 12px; background: #fff; box-shadow: 0 3px 0 #e5eaec; }
.cache-trip .m small { font-size: 12px; font-weight: 800; color: var(--c-ink-soft); white-space: nowrap; }
.cache-trip .m b { font: 900 20px/1.2 var(--font-mono); color: #2b2b2b; }
.cache-trip .m.slow { border-color: #ff9600; } .cache-trip .m.slow b { color: #cd5f00; }
.cache-trip .m.fast { border-color: var(--c-brand); } .cache-trip .m.fast b { color: var(--c-brand-dark); }
.cache-trip .m.bump { animation: ct-bump .6s ease-out; }
@keyframes ct-bump { 0% { transform: scale(1); background: #fff8d6; } 40% { transform: scale(1.06); background: #fff3b0; } 100% { transform: scale(1); background: #fff; } }

/* scene */
.cache-trip .scene { position: absolute; left: 0; top: 78px; width: 600px; height: 280px; border: 2px dashed #e1e6e8; border-radius: 16px;
  background-image: linear-gradient(#f1f4f5 1px, transparent 1px), linear-gradient(90deg, #f1f4f5 1px, transparent 1px); background-size: 24px 24px; }
.cache-trip .track { position: absolute; left: 70px; right: 70px; top: 46px; border-top: 4px dashed #b9c4c9; }
.cache-trip .actor { position: absolute; top: 10px; display: flex; flex-direction: column; align-items: center; gap: 2px; width: 150px; transition: opacity .3s; }
.cache-trip .actor b { font-size: 14.5px; font-weight: 900; color: #2b2b2b; white-space: nowrap; }
.cache-trip .actor small { min-height: 18px; font-size: 12.5px; font-weight: 900; color: #d33131; }
.cache-trip .ask { left: -5px; } .cache-trip .ask b { color: #1378a8; }
.cache-trip .desk { left: 225px; }
.cache-trip .room { right: -5px; }
.cache-trip .room.idle { opacity: .4; } .cache-trip .room.idle small { color: var(--c-ink-soft); }
.cache-trip .room.busy :is(svg) { animation: ct-shake .5s 2 .55s; }
@keyframes ct-shake { 25% { transform: rotate(-4deg); } 75% { transform: rotate(4deg); } }
.cache-trip .actor em, .cache-trip h4 i { padding: 0 8px; border-radius: 999px; background: #2f4550; color: #fff; font: 800 11.5px/1.7 var(--font-mono); white-space: nowrap; }
.cache-trip .actor em.hit { background: var(--c-brand-dark); }
.cache-trip .actor em.evict { background: #d33131; }
.cache-trip .actor em.code { background: #eef3f5; color: #2f4550; }

.cache-trip .board { position: absolute; left: 170px; top: 160px; width: 260px; height: 108px; padding: 6px 10px; box-sizing: border-box; border: 3px solid #d7dde0; border-radius: 14px; background: #fafcfd; transition: border-color .3s, box-shadow .3s; }
.cache-trip .glow { border-color: var(--c-brand); }
.cache-trip .board.glow { box-shadow: 0 0 0 4px #d7f5c0; }
.slide .cache-trip h4 { display: flex; align-items: center; gap: 6px; margin: 0 0 4px; font-size: 13px; font-weight: 900; color: var(--c-ink-soft); }
.cache-trip .notes { display: flex; gap: 10px; min-height: 40px; align-items: center; }
.cache-trip .empty { font-size: 13px; font-weight: 800; color: #b0babe; }
.cache-trip .note { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; background: #ffe98a; box-shadow: 2px 3px 0 #d9bd3f; transform: rotate(-2deg); font: 900 14px var(--font-mono); color: #5a4a00; transition: opacity .3s, transform .3s; }
.cache-trip .note:nth-child(2) { transform: rotate(2deg); }
.cache-trip .note span { padding: 0 5px; border-radius: 5px; background: #fff; }
.cache-trip .note.new { animation: ct-stick .5s ease-out; }
.cache-trip .note.hit { outline: 3px solid var(--c-brand); }
.cache-trip .note.torn { opacity: .25; transform: rotate(-14deg) translateY(8px); text-decoration: line-through; }
@keyframes ct-stick { from { transform: translateY(-30px) rotate(-12deg); opacity: 0; } to { transform: rotate(-2deg); opacity: 1; } }
.cache-trip .kv { margin: 6px 0 0; font-size: 11.5px; font-weight: 800; color: var(--c-ink-soft); }
.cache-trip .kv span { padding: 0 4px; border-radius: 4px; background: #ffe98a; color: #5a4a00; font-family: var(--font-mono); }

/* the request dot: orange on the way in, green on the way back */
.cache-trip .dot { position: absolute; top: 38px; left: 62px; width: 20px; height: 20px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 0 2px #2b2b2b; opacity: 0; z-index: 2; }
.cache-trip .dot.miss { animation: ct-miss 2.6s ease-in-out forwards; }
.cache-trip .dot.hit { animation: ct-hit 1.3s ease-in-out forwards; }
@keyframes ct-miss {
  0% { left: 62px; opacity: 1; background: #ff9600; }
  28% { left: 290px; background: #ff9600; }
  45% { left: 518px; background: #ff9600; }
  60% { left: 518px; background: #58cc02; }
  78% { left: 290px; background: #58cc02; }
  96% { left: 62px; opacity: 1; background: #58cc02; }
  100% { left: 62px; opacity: 0; background: #58cc02; }
}
@keyframes ct-hit {
  0% { left: 62px; opacity: 1; background: #ff9600; }
  45% { left: 290px; background: #ff9600; }
  55% { left: 290px; background: #58cc02; }
  92% { left: 62px; opacity: 1; background: #58cc02; }
  100% { left: 62px; opacity: 0; background: #58cc02; }
}

/* what changed */
.cache-trip .changed { position: absolute; right: 0; top: 78px; width: 260px; height: 280px; padding: 10px 14px; box-sizing: border-box; border: 2px solid #d7dde0; border-radius: 16px; background: #fff; }
.slide .cache-trip h5 { margin: 0 0 8px; font-size: 13px; font-weight: 900; color: var(--c-ink-soft); letter-spacing: .04em; }
.cache-trip ul { margin: 0; padding: 0; list-style: none; }
.slide .cache-trip li { display: flex; align-items: center; gap: 8px; margin: 0 0 7px; font-size: 14.5px; font-weight: 800; color: #2b2b2b; animation: ct-in .35s ease-out both; }
.cache-trip li:nth-child(2) { animation-delay: .12s; }
.cache-trip li span { display: grid; place-items: center; flex: none; width: 20px; height: 20px; border-radius: 6px; font: 900 14px/1 var(--font-mono); color: #fff; }
.cache-trip li.add span { background: var(--c-brand); }
.cache-trip li.mod span { background: #ff9600; }
.cache-trip li.del span { background: #ff4b4b; }
.cache-trip li.note span { background: #9aa7ad; }
@keyframes ct-in { from { opacity: 0; transform: translateX(10px); } }
.cache-trip .bars { margin-top: 12px; }
.slide .cache-trip .bars p { margin: 0 0 6px; font-size: 13px; font-weight: 900; color: var(--c-ink-soft); }
.cache-trip .bar { position: relative; height: 26px; margin-bottom: 6px; border-radius: 8px; background: #f1f4f5; overflow: hidden; }
.cache-trip .bar i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 8px; transform-origin: left; animation: ct-grow .9s ease-out both; }
.cache-trip .bar.no i { background: #ffd1d1; } .cache-trip .bar.yes i { background: #58cc02; min-width: 6px; }
.cache-trip .bar span { position: relative; padding-left: 12px; font-size: 13px; font-weight: 900; line-height: 26px; color: #2b2b2b; white-space: nowrap; }
@keyframes ct-grow { from { transform: scaleX(0); } }

@media (prefers-reduced-motion: reduce) {
  .cache-trip *, .cache-trip { animation: none !important; }
}
</style>
