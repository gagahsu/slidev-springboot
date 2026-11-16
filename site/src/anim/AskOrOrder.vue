<script setup lang="ts">
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch17 story: at the counter a customer either ASKS something out loud (GET: everybody hears it,
// nothing in the shop changes) or HANDS IN a filled order slip (POST: content is on the slip,
// the shop gets a new order). `terms` adds GET / POST to the panel titles.
defineProps<{ terms?: boolean }>()
const { local, live } = useFixedSteps(4)
const at = (n: number) => !live.value || local.value >= n
const captions = ['客人走到櫃台，會做兩種事', '第一種：開口問。問題是用講的，旁邊的人都聽得到', '店員回答完，店裡什麼都沒有改變', '第二種：填一張點單交出去。內容寫在單子上', '店員收下後，店裡多了一張新訂單']
</script>

<template>
  <div class="anim-stage ask-order">
    <section class="panel ask" :class="{ off: !at(1), hot: live && (local === 1 || local === 2) }">
      <h4>開口問<em v-if="terms">GET</em></h4>
      <div class="row">
        <Art name="customer" size="70" />
        <div class="mid">
          <i class="bubble">「珍珠奶茶多少錢？」</i>
          <i class="bubble back" :class="{ off: !at(2) }">「50 元」</i>
        </div>
        <Art name="clerk" size="70" />
      </div>
      <p><span>大家都聽得到</span><span :class="{ off: !at(2) }">店裡沒有改變</span></p>
    </section>
    <section class="panel order" :class="{ off: !at(3), hot: live && local >= 3 }">
      <h4>填單交出去<em v-if="terms">POST</em></h4>
      <div class="row">
        <Art name="customer" size="70" />
        <div class="mid">
          <div class="slip"><Art name="form" size="40" /><b>珍珠奶茶<br>少冰、半糖</b></div>
          <i class="plus" :class="{ off: !at(4) }">訂單簿 ＋1</i>
        </div>
        <Art name="clerk" size="70" />
      </div>
      <p><span>內容寫在單子裡</span><span :class="{ off: !at(4) }">店裡多一筆資料</span></p>
    </section>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.ask-order .off { visibility: hidden; }
.ask-order i { font-style: normal; font-weight: 900; }
.ask-order .panel { position: absolute; top: 14px; width: 426px; height: 262px; padding: 30px 16px 0; border: 3px solid var(--c-line); border-radius: 20px; box-shadow: 0 4px 0 var(--c-line); background: #fff; transition: border-color .3s, box-shadow .3s, background-color .3s; }
.ask-order .ask { left: 0; }
.ask-order .order { right: 0; }
.ask-order .ask.hot { border-color: var(--c-blue); box-shadow: 0 4px 0 var(--c-blue-dark); background: #f2fbff; }
.ask-order .order.hot { border-color: #ff9600; box-shadow: 0 4px 0 #cd7900; background: #fff8ec; }
.slide .ask-order h4 { position: absolute; top: -17px; left: 50%; transform: translateX(-50%); margin: 0; padding: 3px 16px; border-radius: 999px; color: #fff; font-size: 16px; font-weight: 900; white-space: nowrap; }
.ask-order .ask h4 { background: var(--c-blue); }
.ask-order .order h4 { background: #ff9600; }
.ask-order h4 em { margin-left: 8px; padding: 0 8px; border-radius: 999px; background: #fff; color: #2b2b2b; font: 800 13px/1.5 var(--font-mono); font-style: normal; }
.ask-order .row { display: flex; align-items: center; justify-content: space-between; height: 150px; }
.ask-order .mid { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.ask-order .bubble { padding: 6px 12px; border: 2px solid var(--c-blue); border-radius: 14px 14px 14px 2px; background: #fff; font-size: 15px; white-space: nowrap; }
.ask-order .bubble.back { border-color: var(--c-brand); border-radius: 14px 14px 2px 14px; align-self: flex-end; }
.ask-order .slip { display: flex; align-items: center; gap: 6px; padding: 6px 12px 6px 6px; border: 2px solid #ff9600; border-radius: 12px; background: #fff; }
.ask-order .slip b { font-size: 14px; font-weight: 900; line-height: 1.4; color: #2b2b2b; }
.ask-order .plus { padding: 3px 14px; border-radius: 999px; background: var(--c-brand); color: #fff; font-size: 14.5px; }
.slide .ask-order .panel p { display: flex; justify-content: center; gap: 10px; margin: 6px 0 0; }
.ask-order .panel p span { padding: 2px 12px; border-radius: 999px; background: var(--c-polar); color: var(--c-ink); font-size: 13.5px; font-weight: 900; }
</style>
