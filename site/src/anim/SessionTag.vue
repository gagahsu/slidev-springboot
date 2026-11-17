<script setup lang="ts">
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch40 story: the front desk cannot recognise anyone. On the first visit it opens a locker
// (Session), puts a note in it and hands the student a number tag (JSESSIONID cookie). On every
// later visit the student shows the tag and the desk opens the matching locker.
defineProps<{ terms?: boolean }>()
const { local, live } = useFixedSteps(3)
const at = (n: number) => !live.value || local.value >= n
const captions = ['Tom 第一次來，告訴櫃台「我是 Tom」', '櫃台在後面開一格置物櫃，把「這位是 Tom」放進去', '櫃台發一張號碼牌給 Tom，上面只有置物櫃的號碼', '之後 Tom 每次來都出示號碼牌，櫃台打開那一格，就知道他是誰']
</script>

<template>
  <div class="anim-stage session-tag">
    <div class="who">
      <Art name="you" size="78" />
      <b>Tom<em v-if="terms">瀏覽器</em></b>
      <div class="tag" :class="{ off: !at(2) }"><Art name="card" size="22" /><span>A7</span><em v-if="terms">Cookie：JSESSIONID</em></div>
    </div>
    <div class="say s1" :class="{ off: at(3) }">我是 Tom<em v-if="terms">POST /session/login</em></div>
    <div class="say s2" :class="{ off: !at(3) }">（出示號碼牌 A7）<em v-if="terms">每次請求自動帶上 Cookie</em></div>
    <div class="desk">
      <Art name="clerk" size="78" />
      <b>櫃台<em v-if="terms">伺服器</em></b>
      <p class="know" :class="{ off: !at(3) }">A7 … 你是 Tom！</p>
    </div>
    <div class="lockers" :class="{ off: !at(1) }">
      <h4><Art name="cabinet" size="26" />置物櫃<em v-if="terms">Session</em></h4>
      <div class="cell"><span>A5</span><i>…</i></div>
      <div class="cell"><span>A6</span><i>…</i></div>
      <div class="cell mine" :class="{ open: at(3) }"><span>A7</span><i>username = Tom</i></div>
      <small>資料放在櫃台這一邊</small>
    </div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.session-tag .off { visibility: hidden; }
.session-tag i { font-style: normal; }
.session-tag em { margin-left: 6px; padding: 0 8px; border-radius: 999px; background: #2f4550; color: #fff; font: 800 12px/1.7 var(--font-mono); font-style: normal; white-space: nowrap; }
.session-tag .who, .session-tag .desk { position: absolute; top: 20px; width: 170px; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.session-tag .who { left: 0; }
.session-tag .desk { left: 420px; }
.session-tag .who > b, .session-tag .desk > b { font-size: 16px; font-weight: 900; color: #2b2b2b; white-space: nowrap; }
.session-tag .tag { margin-top: 10px; display: flex; align-items: center; gap: 6px; padding: 4px 12px; border: 3px solid #ff9600; border-radius: 12px; background: #fff8ec; box-shadow: 0 3px 0 #cd7900; white-space: nowrap; }
.session-tag .tag span { font: 900 17px var(--font-mono); color: #cd7900; }
.session-tag .say { position: absolute; left: 176px; width: 240px; padding: 8px 12px; border: 3px solid #1cb0f6; border-radius: 16px; background: #e8f7ff; color: #1378a8; font-size: 15px; font-weight: 900; text-align: center; line-height: 1.6; }
.session-tag .say em { display: inline-block; margin: 2px 0 0; }
.session-tag .s1 { top: 26px; }
.session-tag .s2 { top: 26px; }
.session-tag .know { margin: 8px 0 0; padding: 2px 12px; border-radius: 999px; background: #f1ffe4; border: 2px solid var(--c-brand); color: var(--c-brand-dark); font-size: 14px; font-weight: 900; white-space: nowrap; }
.session-tag .lockers { position: absolute; right: 0; top: 6px; width: 250px; padding: 12px 14px; border: 3px solid #ce82ff; border-radius: 18px; box-shadow: 0 4px 0 #a568cc; background: #faf2ff; }
.slide .session-tag h4 { display: flex; align-items: center; gap: 6px; margin: 0 0 6px; font-size: 16px; font-weight: 900; color: #2b2b2b; white-space: nowrap; }
.session-tag .cell { display: flex; align-items: center; gap: 10px; margin-top: 6px; padding: 4px 10px; border: 2px solid #dcc6f2; border-radius: 10px; background: #fff; font: 800 14px/1.8 var(--font-mono); color: #9aa7ad; transition: border-color .3s, background-color .3s; }
.session-tag .cell span { color: #7d3fb0; font-weight: 900; }
.session-tag .cell.mine { color: #2b2b2b; border-color: #a568cc; }
.session-tag .cell.mine.open { border-color: var(--c-brand); background: #f1ffe4; }
.session-tag .lockers small { display: block; margin-top: 6px; color: #7d3fb0; font-size: 12.5px; font-weight: 900; }
</style>
