<script setup lang="ts">
import { useFixedSteps } from '../lib/steps'

// ch42: fixedRate counts from the START of the previous run, fixedDelay from its END.
// Both rows: the job takes 3 s, the setting is 5 s.
defineProps<{ terms?: boolean }>()
const { local, live } = useFixedSteps(2)
const at = (n: number) => !live.value || local.value >= n
const S = 43
const rate = [0, 5, 10, 15]
const delay = [0, 8, 16]
const ticks = Array.from({ length: 20 }, (_, i) => i)
const captions = ['固定頻率：看時鐘。每 5 秒「開始」一次，不管上一次做了多久', '固定延遲：看做完的時間。做完之後休息 5 秒，才開始下一次', '同樣設定 5 秒、每次做 3 秒：一個每 5 秒一次，一個每 8 秒一次']
</script>

<template>
  <div class="anim-stage rate-delay">
    <div class="row r1">
      <h4>固定頻率<em v-if="terms">fixedRate = 5000</em></h4>
      <div class="track">
        <span v-for="t in rate" :key="t" class="job" :style="{ left: t * S + 'px', width: 3 * S + 'px' }">做 3 秒</span>
        <i v-for="t in rate.slice(0, 3)" :key="'g' + t" class="gap" :class="{ off: !at(2) }" :style="{ left: t * S + 'px', width: 5 * S + 'px' }">開始 → 開始：5 秒</i>
      </div>
    </div>
    <div class="row r2" :class="{ off: !at(1) }">
      <h4>固定延遲<em v-if="terms">fixedDelay = 5000</em></h4>
      <div class="track">
        <span v-for="t in delay" :key="t" class="job" :style="{ left: t * S + 'px', width: 3 * S + 'px' }">做 3 秒</span>
        <i v-for="t in delay.slice(0, 2)" :key="'g' + t" class="gap" :class="{ off: !at(2) }" :style="{ left: (t + 3) * S + 'px', width: 5 * S + 'px' }">結束 → 開始：5 秒</i>
      </div>
    </div>
    <div class="axis"><span v-for="t in ticks" :key="t" :style="{ left: t * S + 'px' }" :class="{ big: t % 5 === 0 }">{{ t % 5 === 0 ? t + 's' : '' }}</span></div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.rate-delay .off { visibility: hidden; }
.rate-delay i { font-style: normal; }
.rate-delay em { margin-left: 8px; padding: 0 9px; border-radius: 999px; background: #2f4550; color: #fff; font: 800 12.5px/1.7 var(--font-mono); font-style: normal; white-space: nowrap; }
.rate-delay .row { position: absolute; left: 0; width: 100%; }
.rate-delay .r1 { top: 0; }
.rate-delay .r2 { top: 118px; }
.slide .rate-delay h4 { display: flex; align-items: center; margin: 0 0 6px; font-size: 16px; font-weight: 900; color: #2b2b2b; }
.rate-delay .track { position: relative; height: 74px; margin-left: 12px; border-bottom: 3px solid #d7dde0; }
.rate-delay .job { position: absolute; top: 0; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 13.5px; font-weight: 900; color: #fff; }
.rate-delay .r1 .job { background: #1cb0f6; box-shadow: 0 3px 0 #1378a8; }
.rate-delay .r2 .job { background: #ff9600; box-shadow: 0 3px 0 #cd7900; }
.rate-delay .gap { position: absolute; top: 46px; height: 22px; box-sizing: border-box; border: 2px dashed #9aa7ad; border-top: 0; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; font-weight: 900; color: #5f6b70; line-height: 18px; white-space: nowrap; }
.rate-delay .axis { position: absolute; left: 12px; top: 232px; height: 24px; width: 100%; }
.rate-delay .axis span { position: absolute; top: 0; width: 2px; height: 6px; background: #c5cdd1; font-size: 12.5px; font-weight: 900; color: #5f6b70; text-indent: -8px; line-height: 34px; white-space: nowrap; }
.rate-delay .axis span.big { height: 10px; background: #8a979d; }
</style>
