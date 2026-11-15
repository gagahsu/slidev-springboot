<script setup lang="ts">
import { computed } from 'vue'
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch10 story: every machine collects money and keeps the books itself (mode="each"),
// or all machines go through one counter that does it for them (mode="counter" = an aspect).
const props = withDefaults(defineProps<{ mode?: 'each' | 'counter' }>(), { mode: 'each' })
const counter = computed(() => props.mode === 'counter')
const { local, live } = useFixedSteps(3)
const at = (n: number) => !live.value || local.value >= n
const price = computed(() => (at(3) ? 3 : 2))

const machines = [
  { art: 'printer', name: '黑白印表機', method: 'print()' },
  { art: 'printer2', name: '彩色印表機', method: 'printColor()' },
  { art: 'printer', name: '雙面印表機', method: 'printDouble()' },
]
const captions = computed(() => counter.value
  ? ['店裡設了一個櫃台，所有機器都要經過它', '印之前，櫃台統一收錢', '印完之後，櫃台統一記帳，機器只管印', '改收 3 元？只改櫃台，機器一台都不用動']
  : ['店裡有三台機器', '每台機器都自己裝了收錢的投幣孔', '每台機器還要自己記帳', '老闆想改收 3 元…三台機器都要一台一台改'])
</script>

<template>
  <div class="anim-stage counter-scene" :class="[mode, `s${local}`]">
    <div v-if="counter" class="desk">
      <span class="label">櫃台</span>
      <Art name="clerk" size="84" />
      <i class="tag pay" :class="{ off: !at(1), hot: at(3) }">印之前：收 {{ price }} 元</i>
      <i class="tag book" :class="{ off: !at(2) }">印完：記帳</i>
      <b v-if="at(3)" class="only">只改這裡</b>
    </div>
    <div v-if="counter" class="pass"><span>都要經過</span></div>

    <div class="machines">
      <div v-for="(m, n) in machines" :key="n" class="machine" :class="{ dirty: !counter && at(3) }">
        <Art :name="m.art" size="74" />
        <b>{{ m.name }}</b>
        <code>{{ m.method }}</code>
        <template v-if="!counter">
          <i class="tag pay" :class="{ off: !at(1), hot: at(3) }">收 {{ price }} 元</i>
          <i class="tag book" :class="{ off: !at(2) }">記帳</i>
        </template>
        <i v-else class="tag focus">只管印</i>
      </div>
    </div>
    <b v-if="!counter && at(3)" class="redo">要改 3 次！</b>

    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.counter-scene b { font-weight: 900; color: #2b2b2b; }
.counter-scene .off { visibility: hidden; }
.counter-scene .tag { display: block; margin-top: 6px; padding: 2px 10px; border-radius: 999px; font-size: 13.5px; font-style: normal; font-weight: 900; text-align: center; white-space: nowrap; transition: background-color .3s; }
.counter-scene .tag.pay { background: #fff3c4; color: #8a6d00; border: 2px solid #ffc800; }
.counter-scene .tag.pay.hot { background: #ff4b4b; border-color: #ff4b4b; color: #fff; }
.counter-scene .tag.book { background: var(--c-blue-soft); color: var(--c-blue-dark); border: 2px solid #84d8ff; }
.counter-scene .tag.focus { background: #e5f9d3; color: var(--c-brand-dark); border: 2px solid #b7e88a; }
.counter-scene .machines { position: absolute; top: 20px; display: flex; gap: 22px; }
.counter-scene.each .machines { left: 110px; }
.counter-scene.counter .machines { left: 330px; gap: 16px; }
.counter-scene .machine { display: flex; flex-direction: column; align-items: center; width: 190px; padding: 12px 10px 14px; border: 3px solid var(--c-line); border-radius: 20px; box-shadow: 0 4px 0 var(--c-line); background: #fff; transition: border-color .3s, box-shadow .3s; }
.counter-scene.counter .machine { width: 166px; }
.counter-scene .machine.dirty { border-color: #ff4b4b; box-shadow: 0 4px 0 #d33131; }
.counter-scene .machine b { margin-top: 4px; font-size: 16px; }
.counter-scene .machine code { margin-top: 2px; padding: 0 8px; border-radius: 7px; background: var(--c-polar); color: var(--c-ink-soft); font: 700 12.5px/1.6 var(--font-mono); }
.counter-scene .redo { position: absolute; left: 50%; top: 262px; transform: translateX(-50%); padding: 3px 16px; border-radius: 999px; background: #ff4b4b; color: #fff; font-size: 16px; }
.counter-scene .desk { position: absolute; left: 0; top: 20px; display: flex; flex-direction: column; align-items: center; width: 220px; height: 246px; padding: 36px 14px 14px; border: 3px solid #ce82ff; border-radius: 20px; box-shadow: 0 4px 0 #a568cc; background: #faf2ff; }
.counter-scene .desk .label { position: absolute; top: -15px; padding: 3px 16px; border-radius: 999px; background: #ce82ff; color: #fff; font-size: 15px; font-weight: 900; }
.counter-scene .desk .tag { width: 100%; font-size: 14.5px; }
.counter-scene .desk .only { position: absolute; bottom: -14px; padding: 2px 12px; border-radius: 999px; background: var(--c-brand); color: #fff; font-size: 14px; }
.counter-scene .pass { position: absolute; left: 226px; top: 128px; width: 100px; height: 6px; border-radius: 3px; background: #ce82ff; }
.counter-scene .pass::after { content: ''; position: absolute; right: -6px; top: -7px; border: 10px solid transparent; border-left: 12px solid #ce82ff; border-right: 0; }
.counter-scene .pass span { position: absolute; left: 50%; top: -28px; transform: translateX(-50%); color: #7d3fb0; font-size: 12.5px; font-weight: 900; white-space: nowrap; }
</style>
