<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'
import { usePoses, type Pose } from './poses'

// Everyday story for IoC: camping (you prepare and look after everything) vs a hotel (it is prepared for you).
const props = withDefaults(defineProps<{ mode?: 'camping' | 'hotel' }>(), { mode: 'camping' })
const hotel = computed(() => props.mode === 'hotel')
const root = ref<HTMLElement>()
const { local, animated } = useFixedSteps(3)

const gone: Pose = { opacity: 0, scale: 0.5 }
const camping: Record<string, Pose[]> = {
  tent: [{ x: 230, y: 70, ...gone }, { x: 230, y: 70 }, { x: 230, y: 70 }, { x: 230, y: 70, ...gone }],
  tent2: [{ x: 230, y: 40, ...gone }, { x: 230, y: 40, ...gone }, { x: 230, y: 40, ...gone }, { x: 230, y: 40 }],
  backpack: [{ x: 420, y: 100, ...gone }, { x: 420, y: 100 }],
  pot: [{ x: 545, y: 105, ...gone }, { x: 545, y: 105 }],
  stove: [{ x: 670, y: 100, ...gone }, { x: 670, y: 100 }, { x: 670, y: 108, rotate: -14 }],
}
const staying: Record<string, Pose[]> = {
  bed: [{ x: 40, y: 150 }, { x: 40, y: 150 }, { x: 468, y: 176 }],
  towel: [{ x: 130, y: 150 }, { x: 130, y: 150 }, { x: 592, y: 176 }, { x: 130, y: 150, opacity: 0.45 }],
  towel2: [{ x: 130, y: 150, ...gone }, { x: 130, y: 150, ...gone }, { x: 130, y: 150, ...gone }, { x: 592, y: 176 }],
  brush: [{ x: 220, y: 150 }, { x: 220, y: 150 }, { x: 716, y: 176 }],
  ask: [{ opacity: 0, y: 10 }, { opacity: 1, y: 0 }, { opacity: 0 }, { opacity: 0 }],
  swap: [{ opacity: 0 }, { opacity: 0 }, { opacity: 0 }, { opacity: 1 }],
}
usePoses(root, local, hotel.value ? staying : camping, animated)

const captions = computed(() => hotel.value
  ? ['飯店早就把床、毛巾、牙刷準備好了', '你只要說一句：「我要一間房」', '飯店把東西送進你的房間，你什麼都不用帶', '毛巾髒了？飯店會換一條新的，你不用管']
  : ['週末想去露營，過夜要有地方睡、有東西吃', '帳篷、背包、鍋子、瓦斯爐，全部自己買、自己帶', '瓦斯爐壞了…只能自己想辦法', '想換大一點的帳篷？自己重買、自己重搭'])
</script>

<template>
  <div ref="root" class="anim-stage life-ioc" :class="[mode, `s${local}`]">
    <template v-if="!hotel">
      <div class="me"><Art name="you" size="130" /><b>你</b></div>
      <div class="thing" data-actor="tent"><Art name="tent" size="130" /><b>帳篷</b></div>
      <div class="thing big" data-actor="tent2"><Art name="tent-big" size="165" /><b>大帳篷</b><i class="tag bad">自己重買</i></div>
      <div class="thing" data-actor="backpack"><Art name="backpack" size="95" /><b>背包</b></div>
      <div class="thing" data-actor="pot"><Art name="pot" size="95" /><b>鍋子</b></div>
      <div class="thing" data-actor="stove"><Art name="stove" size="100" /><b>瓦斯爐</b><i v-if="local >= 2" class="tag bad">壞了</i></div>
    </template>

    <template v-else>
      <div class="place">
        <span class="name"><Art name="hotel" size="34" />飯店</span>
        <div class="staff"><Art name="staff" size="78" /></div>
      </div>
      <div class="room"><span class="name">你的房間</span></div>
      <div class="me right"><Art name="you" size="100" /><b>你</b></div>
      <div class="bubble" data-actor="ask">「我要一間房」</div>
      <div class="bubble staff-says" data-actor="swap">「幫您換一條新的」</div>
      <div class="thing" data-actor="bed"><Art name="bed" size="84" /><b>床</b></div>
      <div class="thing" data-actor="towel"><Art :name="local >= 3 ? 'towel-dirty' : 'towel'" size="84" /><b>{{ local >= 3 ? '髒毛巾' : '毛巾' }}</b></div>
      <div class="thing" data-actor="towel2"><Art name="towel" size="84" /><b>新毛巾</b></div>
      <div class="thing" data-actor="brush"><Art name="brush" size="84" /><b>牙刷</b></div>
    </template>

    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.life-ioc .me { position: absolute; left: 50px; top: 70px; display: flex; flex-direction: column; align-items: center; }
.life-ioc .me.right { left: 736px; top: 14px; }
.life-ioc b { font-size: 15px; font-weight: 900; color: #2b2b2b; line-height: 1.4; }
.life-ioc .thing { position: absolute; left: 0; top: 0; display: flex; flex-direction: column; align-items: center; }
.life-ioc .tag { position: absolute; top: -6px; right: -18px; padding: 2px 10px; border-radius: 999px; color: #fff; font-size: 13px; font-style: normal; font-weight: 900; white-space: nowrap; }
.life-ioc .tag.bad { background: #ff4b4b; }
.life-ioc .place { position: absolute; left: 16px; top: 10px; width: 310px; height: 280px; border: 3px dashed #ce82ff; border-radius: 22px; background: #faf2ff; }
.life-ioc .room { position: absolute; left: 446px; top: 140px; width: 400px; height: 150px; border: 3px dashed var(--c-blue); border-radius: 22px; background: #f2fbff; }
.life-ioc .name { position: absolute; left: 14px; top: 10px; display: inline-flex; align-items: center; gap: 6px; padding: 2px 12px 2px 6px; border-radius: 999px; background: #ce82ff; color: #fff; font-size: 14px; font-weight: 900; }
.life-ioc .room .name { padding-left: 12px; background: var(--c-blue); }
.life-ioc .staff { position: absolute; right: 18px; top: 22px; }
.life-ioc .bubble { position: absolute; left: 548px; top: 34px; padding: 8px 14px; border: 3px solid var(--c-blue); border-radius: 16px 16px 4px 16px; background: #fff; color: var(--c-blue-dark); font-size: 16px; font-weight: 900; white-space: nowrap; }
.life-ioc .bubble.staff-says { left: 336px; top: 62px; border-color: #ce82ff; border-radius: 16px 16px 16px 4px; color: #7d3fb0; }
</style>
