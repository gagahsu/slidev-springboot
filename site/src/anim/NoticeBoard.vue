<script setup lang="ts">
import { computed } from 'vue'
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch09 story: the notice at the store entrance holds the numbers; the printer reads it when the store opens.
const { local, live } = useFixedSteps(3)
const at = (n: number) => !live.value || local.value >= n
const sheets = computed(() => (at(2) ? 10 : 5))
const loaded = computed(() => (at(3) ? '剩 10 張' : at(1) ? '剩 5 張' : '紙匣：空的'))

const captions = [
  '便利商店門口，貼著一張公告',
  '開店時，印表機照著公告放進 5 張紙',
  '老闆想改成 10 張：只要改公告上的數字',
  '下次開店，印表機照新公告放 10 張，機器完全不用動',
]
</script>

<template>
  <div class="anim-stage notice-board" :class="`s${local}`">
    <div class="board">
      <h5>本店公告</h5>
      <p>黑白列印：每張 <b>2</b> 元</p>
      <p class="line" :class="{ reading: local === 1 || local === 3 }">每次放紙：<b :key="sheets" class="num">{{ sheets }}</b> 張<s v-if="at(2)">5</s></p>
    </div>
    <div class="owner" :class="{ off: !at(2) }"><Art name="staff" size="84" /><b>老闆</b><i>改公告</i></div>
    <div class="look" :class="{ off: !at(1) }">← 開店時看公告</div>
    <div class="machine">
      <Art name="printer" size="120" />
      <b>印表機</b>
      <small :class="{ full: at(1) }">{{ loaded }}</small>
      <i class="same" :class="{ off: !at(3) }">機器完全沒拆</i>
    </div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.notice-board b { font-weight: 900; color: #2b2b2b; }
.notice-board .off { opacity: 0; }
.notice-board .board { position: absolute; left: 40px; top: 20px; width: 320px; padding: 14px 20px 18px; border: 4px solid #8a5a3c; border-radius: 16px; background: #fff8e6; box-shadow: 0 6px 0 #6b4226; }
.notice-board .board h5 { margin: 0 0 10px; padding-bottom: 6px; border-bottom: 3px dashed #d9a066; font-size: 21px; font-weight: 900; color: #6b4226; text-align: center; }
.notice-board .board p { margin: 8px 0; padding: 6px 10px; border-radius: 10px; font-size: 19px; font-weight: 800; color: #2b2b2b; transition: background-color .3s, box-shadow .3s; }
.notice-board .board p.reading { background: #fff3c4; box-shadow: inset 4px 0 0 #ffc800; }
.notice-board .num { display: inline-block; min-width: 1.4em; color: #c62828; font-size: 24px; text-align: center; animation: notice-pop .4s ease-out; }
.notice-board s { margin-left: 8px; color: var(--c-muted); font-size: 15px; }
@keyframes notice-pop { from { transform: scale(1.6); } }
.notice-board .owner { position: absolute; left: 400px; top: 170px; display: flex; flex-direction: column; align-items: center; transition: opacity .35s; }
.notice-board .owner i { position: absolute; left: 76px; top: 10px; padding: 3px 12px; border-radius: 999px; background: #ce82ff; color: #fff; font-size: 13px; font-style: normal; font-weight: 900; white-space: nowrap; }
.notice-board .look { position: absolute; left: 390px; top: 110px; padding: 4px 12px; border-radius: 999px; background: var(--c-blue-soft); color: var(--c-blue-dark); font-size: 15px; font-weight: 900; transition: opacity .35s; }
.notice-board .machine { position: absolute; left: 640px; top: 40px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.notice-board .machine small { padding: 2px 14px; border-radius: 999px; background: var(--c-polar); color: var(--c-ink-soft); font-size: 15px; font-weight: 900; }
.notice-board .machine small.full { background: var(--c-brand); color: #fff; }
.notice-board .same { margin-top: 6px; padding: 3px 12px; border-radius: 999px; background: #e5f9d3; color: var(--c-brand-dark); font-size: 14px; font-style: normal; font-weight: 900; transition: opacity .35s; }
</style>
