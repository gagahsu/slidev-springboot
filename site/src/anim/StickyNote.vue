<script setup lang="ts">
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch43 story: the first time someone asks about student 3 the desk goes all the way to the file
// room, then copies the answer onto a sticky note. The next time it just reads the note. When
// the record changes the note is torn off.
defineProps<{ terms?: boolean }>()
const { local, live } = useFixedSteps(3)
const at = (n: number) => !live.value || local.value >= n
const is = (n: number) => live.value && local.value === n
const captions = ['第一次有人問 3 號同學：櫃台請人進檔案室查，要等一陣子', '查到之後，順手把答案抄在便利貼上，貼在櫃台', '第二次有人問 3 號：直接看便利貼就回答，沒有人進檔案室', '3 號的資料被修改了：把舊的便利貼撕掉，下次再重新查、重新抄']
</script>

<template>
  <div class="anim-stage sticky-note">
    <div class="ask">
      <Art name="you" size="70" />
      <b>「3 號同學的成績單？」</b>
      <small :class="{ off: !at(2) || at(3) }">第二次問</small>
    </div>
    <div class="desk">
      <Art name="clerk" size="76" />
      <b>櫃台</b>
      <div class="board">
        <h4>便利貼<em v-if="terms">Cache：students</em></h4>
        <div class="note" :class="{ off: !at(1), torn: at(3), hit: is(2) }">
          <span>3 號</span><i>Judy・85・B</i>
        </div>
        <p class="tip t1" :class="{ off: !is(1) }">抄下來{{ terms ? '（Miss 之後存入）' : '' }}</p>
        <p class="tip t2" :class="{ off: !is(2) }">有！直接回答{{ terms ? '（Cache Hit）' : '' }}</p>
        <p class="tip t3" :class="{ off: !at(3) }">撕掉<em v-if="terms">@CacheEvict</em></p>
      </div>
    </div>
    <div class="way" :class="{ dim: is(2) }">
      <span>{{ is(2) ? '這次不用去' : '進檔案室查' }}</span>
      <em v-if="terms && !is(2)">方法本體：查資料庫</em>
      <em v-if="terms && is(2)">方法本體不執行</em>
    </div>
    <div class="room" :class="{ dim: is(2) }">
      <Art name="cabinet" size="76" />
      <b>檔案室</b>
      <small>{{ is(2) ? '沒有人來' : '慢' }}</small>
    </div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.sticky-note .off { visibility: hidden; }
.sticky-note i { font-style: normal; }
.sticky-note em { margin-left: 6px; padding: 0 8px; border-radius: 999px; background: #2f4550; color: #fff; font: 800 12px/1.7 var(--font-mono); font-style: normal; white-space: nowrap; }
.sticky-note .ask, .sticky-note .desk, .sticky-note .room { position: absolute; top: 8px; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.sticky-note .ask { left: 0; width: 210px; }
.sticky-note .ask b { font-size: 14.5px; font-weight: 900; color: #1378a8; white-space: nowrap; }
.sticky-note .ask small { font-size: 12.5px; font-weight: 900; color: var(--c-ink-soft); }
.sticky-note .desk { left: 226px; width: 300px; }
.sticky-note .desk > b, .sticky-note .room > b { font-size: 16px; font-weight: 900; color: #2b2b2b; }
.sticky-note .board { position: relative; margin-top: 8px; width: 290px; height: 124px; padding: 8px 12px; box-sizing: border-box; border: 3px solid #d7dde0; border-radius: 16px; background: #fafcfd; }
.slide .sticky-note h4 { display: flex; align-items: center; margin: 0 0 6px; font-size: 14px; font-weight: 900; color: var(--c-ink-soft); white-space: nowrap; }
.sticky-note .note { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; background: #ffe98a; box-shadow: 2px 3px 0 #d9bd3f; transform: rotate(-2deg); font: 900 14.5px var(--font-mono); color: #5a4a00; transition: opacity .3s, transform .3s; }
.sticky-note .note span { padding: 0 6px; border-radius: 6px; background: #fff; }
.sticky-note .note.hit { outline: 3px solid var(--c-brand); }
.sticky-note .note.torn { opacity: .25; transform: rotate(-14deg) translateY(10px); text-decoration: line-through; }
.sticky-note .tip { position: absolute; left: 12px; bottom: 6px; margin: 0; font-size: 13px; font-weight: 900; white-space: nowrap; }
.sticky-note .t1 { color: #a07c00; }
.sticky-note .t2 { color: var(--c-brand-dark); }
.sticky-note .t3 { color: #d33131; }
.sticky-note .way { position: absolute; left: 536px; top: 36px; width: 190px; padding-bottom: 8px; border-bottom: 4px dashed #9aa7ad; text-align: center; transition: opacity .3s; }
.sticky-note .way span { display: block; font-size: 14px; font-weight: 900; color: #5f6b70; }
.sticky-note .way em { display: inline-block; margin: 4px 0 0; }
.sticky-note .room { right: 0; width: 130px; transition: opacity .3s; }
.sticky-note .room small { font-size: 13px; font-weight: 900; color: #d33131; }
.sticky-note .dim { opacity: .35; }
.sticky-note .dim.room small { color: var(--c-ink-soft); }
</style>
