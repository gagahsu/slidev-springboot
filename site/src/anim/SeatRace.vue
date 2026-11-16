<script setup lang="ts">
import { computed } from 'vue'
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch33 story: two students grab the last seat of an elective course at the same moment.
//   mode="race": no protection, both succeed (oversold).
//   mode="pessimistic": the first one locks the book, the other waits.
//   mode="optimistic": the book has a version number; the later hand-in is rejected.
type Tone = '' | 'ok' | 'bad' | 'wait'
interface Frame { cap: string, remain: number, version?: number, lock?: boolean, a: [string, Tone], b: [string, Tone], taken?: number }
const props = defineProps<{ mode?: 'race' | 'pessimistic' | 'optimistic' }>()
const frames = computed<Frame[]>(() => props.mode === 'pessimistic'
  ? [
      { cap: '悲觀的做法：先假設「一定會有人跟我搶」', remain: 1, a: ['', ''], b: ['', ''] },
      { cap: '小明先到：把選課簿拿走並鎖上。小美只能在旁邊等', remain: 1, lock: true, a: ['拿到簿子，上鎖', 'ok'], b: ['等待中…', 'wait'] },
      { cap: '小明把名額改成 0，報名成功，然後把鎖打開', remain: 0, a: ['報名成功', 'ok'], b: ['等待中…', 'wait'], taken: 1 },
      { cap: '輪到小美：她看到的是最新的「剩 0」，所以知道額滿了', remain: 0, a: ['報名成功', 'ok'], b: ['額滿，報名失敗', 'bad'], taken: 1 },
    ]
  : props.mode === 'optimistic'
    ? [
        { cap: '樂觀的做法：不鎖簿子，但是簿子上多一格「版本」', remain: 1, version: 1, a: ['', ''], b: ['', ''] },
        { cap: '兩個人同時翻開：都看到「剩 1、版本 1」', remain: 1, version: 1, a: ['看到：剩 1、版本 1', ''], b: ['看到：剩 1、版本 1', ''] },
        { cap: '小明先交件：簿子還是版本 1，對得上。成功，版本變成 2', remain: 0, version: 2, a: ['報名成功', 'ok'], b: ['看到：剩 1、版本 1', ''], taken: 1 },
        { cap: '小美交件：她手上是版本 1，簿子已經是版本 2。對不上，退件', remain: 0, version: 2, a: ['報名成功', 'ok'], b: ['被退件，請重試', 'bad'], taken: 1 },
      ]
    : [
        { cap: '攝影課只剩最後 1 個名額', remain: 1, a: ['', ''], b: ['', ''] },
        { cap: '小明和小美同時翻開選課簿：兩個人都看到「剩 1」', remain: 1, a: ['看到：剩 1', ''], b: ['看到：剩 1', ''] },
        { cap: '兩個人各自把 1 改成 0，都以為自己搶到了', remain: 0, a: ['報名成功', 'ok'], b: ['報名成功', 'ok'], taken: 2 },
        { cap: '結果：名額只有 1 個，卻收了 2 個人', remain: 0, a: ['報名成功', 'ok'], b: ['報名成功', 'ok'], taken: 2 },
      ])
const { local, live } = useFixedSteps(3)
const f = computed(() => frames.value[live.value ? local.value : 3])
const over = computed(() => (f.value.taken ?? 0) > 1 && (!live.value || local.value >= 3))
</script>

<template>
  <div class="anim-stage seat-race">
    <div class="who a">
      <Art name="you" size="78" /><b>小明</b>
      <i :class="[f.a[1], { off: !f.a[0] }]">{{ f.a[0] || '　' }}</i>
    </div>
    <div class="book" :class="{ locked: f.lock, over }">
      <h4><Art name="book" size="28" />選課簿：攝影課</h4>
      <p>剩餘名額</p>
      <b>{{ f.remain }}</b>
      <span v-if="f.version" class="ver">版本 {{ f.version }}</span>
      <span class="taken" :class="{ off: !f.taken }">已報名 {{ f.taken }} 人</span>
      <em v-if="f.lock" class="lock"><Art name="lock" size="40" /></em>
    </div>
    <div class="who b">
      <Art name="customer" size="78" /><b>小美</b>
      <i :class="[f.b[1], { off: !f.b[0] }]">{{ f.b[0] || '　' }}</i>
    </div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ frames[local].cap }}</p>
  </div>
</template>

<style>
.seat-race .off { visibility: hidden; }
.seat-race .who { position: absolute; top: 40px; display: flex; flex-direction: column; align-items: center; gap: 4px; width: 250px; }
.seat-race .who.a { left: 0; } .seat-race .who.b { right: 0; }
.seat-race .who b { font-size: 16px; font-weight: 900; color: #2b2b2b; }
.seat-race .who i { margin-top: 6px; padding: 5px 14px; border: 2px solid var(--c-blue); border-radius: 14px; background: #f2fbff; color: var(--c-blue-dark); font-size: 15px; font-style: normal; font-weight: 900; white-space: nowrap; }
.seat-race .who i.ok { border-color: var(--c-brand); background: #f1ffe4; color: var(--c-brand-dark); }
.seat-race .who i.bad { border-color: #ff4b4b; background: #fff1f1; color: #d33131; }
.seat-race .who i.wait { border-color: #ffc800; background: #fff8d6; color: #8a6d00; }
.seat-race .book { position: absolute; left: 50%; top: 14px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; width: 280px; height: 244px; padding-top: 14px; border: 3px solid #ce82ff; border-radius: 22px; box-shadow: 0 4px 0 #a568cc; background: #faf2ff; transition: border-color .3s, box-shadow .3s, background-color .3s; }
.seat-race .book.locked { border-color: #ffc800; box-shadow: 0 4px 0 #cda000; background: #fffbe8; }
.seat-race .book.over { border-color: #ff4b4b; box-shadow: 0 4px 0 #d33131; background: #fff1f1; }
.slide .seat-race h4 { display: flex; align-items: center; gap: 6px; margin: 0; font-size: 17px; font-weight: 900; color: #2b2b2b; }
.seat-race .book p { margin: 8px 0 0; color: var(--c-ink-soft); font-size: 14px; font-weight: 800; }
.seat-race .book > b { font-size: 56px; font-weight: 900; line-height: 1.15; color: #2b2b2b; }
.seat-race .ver { padding: 1px 14px; border-radius: 999px; background: #2f4550; color: #fff; font-size: 14px; font-weight: 900; }
.seat-race .taken { margin-top: 6px; font-size: 15px; font-weight: 900; color: var(--c-ink-soft); }
.seat-race .book.over .taken { color: #d33131; }
.seat-race .lock { position: absolute; right: -16px; top: -18px; }
</style>
