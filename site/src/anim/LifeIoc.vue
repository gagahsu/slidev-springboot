<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'
import { usePoses, type Pose } from './poses'

// Everyday story for IoC: 小明 prints his homework at home (buys and looks after everything himself)
// or at a convenience store (everything is ready; the store looks after it).
const props = withDefaults(defineProps<{ mode?: 'home' | 'store' }>(), { mode: 'home' })
const store = computed(() => props.mode === 'store')
const root = ref<HTMLElement>()
const { local, animated } = useFixedSteps(3)

const gone: Pose = { opacity: 0, scale: 0.5 }
const atHome: Record<string, Pose[]> = {
  printer: [{ x: 250, y: 70, ...gone }, { x: 250, y: 70 }, { x: 250, y: 70 }, { x: 250, y: 92, rotate: -14, ...gone }],
  printer2: [{ x: 250, y: 70, ...gone }, { x: 250, y: 70, ...gone }, { x: 250, y: 70, ...gone }, { x: 250, y: 70 }],
  paper: [{ x: 450, y: 82, ...gone }, { x: 450, y: 82 }],
  ink: [{ x: 620, y: 82, ...gone }, { x: 620, y: 82 }],
}
const atStore: Record<string, Pose[]> = {
  ask: [{ opacity: 0, y: 10 }, { opacity: 1, y: 0 }, { opacity: 0 }, { opacity: 0 }],
  doc: [{ x: 150, y: 120, ...gone }, { x: 150, y: 120, ...gone }, { x: 690, y: 182 }],
  clerkSays: [{ opacity: 0 }, { opacity: 0 }, { opacity: 0 }, { opacity: 1 }],
}
usePoses(root, local, store.value ? atStore : atHome, animated)

const captions = computed(() => store.value
  ? ['便利商店早就把印表機、紙、墨水準備好了', '小明只要跟店員說：「我要印這份作業」', '幾秒鐘就印好了，小明拿了就走', '沒墨水、機器壞了？店家會處理，小明不用管']
  : ['小明要印作業，可是家裡什麼都沒有', '印表機、紙、墨水，全部要自己買回家', '印到一半沒墨水了…只能自己再去買', '印表機壞了？只能自己修、自己重買'])
</script>

<template>
  <div ref="root" class="anim-stage life-ioc" :class="[mode, `s${local}`]">
    <template v-if="!store">
      <div class="me"><Art name="you" size="130" /><b>小明</b><i class="tag hw">要印作業</i></div>
      <div class="thing" data-actor="printer"><Art name="printer" size="120" /><b>印表機</b></div>
      <div class="thing" data-actor="printer2"><Art name="printer" size="120" /><b>新印表機</b><i class="tag bad">舊的壞了，自己重買</i></div>
      <div class="thing" data-actor="paper"><Art name="paper" size="100" /><b>紙</b></div>
      <div class="thing" data-actor="ink"><Art :name="local >= 2 ? 'ink-empty' : 'ink'" size="100" /><b>墨水</b><i v-if="local >= 2" class="tag bad">沒墨水了</i></div>
    </template>

    <template v-else>
      <div class="place">
        <span class="name"><Art name="store" size="30" />便利商店</span>
        <div class="clerk"><Art name="clerk" size="76" /></div>
        <div class="row">
          <div class="item"><Art name="printer" size="70" /><b>印表機</b></div>
          <div class="item"><Art name="paper" size="58" /><b>紙</b></div>
          <div class="item"><Art name="ink" size="58" /><b>墨水</b></div>
        </div>
      </div>
      <div class="me right"><Art name="you" size="120" /><b>小明</b></div>
      <div class="bubble" data-actor="ask">「我要印這份作業」</div>
      <div class="bubble clerk-says" data-actor="clerkSays">「墨水我們會換」</div>
      <div class="thing" data-actor="doc"><Art name="doc" size="78" /><b>印好的作業</b></div>
    </template>

    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.life-ioc .me { position: absolute; left: 40px; top: 70px; display: flex; flex-direction: column; align-items: center; }
.life-ioc .me.right { left: 720px; top: 20px; }
.life-ioc b { font-size: 15px; font-weight: 900; color: #2b2b2b; line-height: 1.4; }
.life-ioc .thing { position: absolute; left: 0; top: 0; display: flex; flex-direction: column; align-items: center; }
.life-ioc .tag { position: absolute; top: -6px; right: -22px; padding: 2px 10px; border-radius: 999px; color: #fff; font-size: 13px; font-style: normal; font-weight: 900; white-space: nowrap; }
.life-ioc .tag.bad { background: #ff4b4b; }
.life-ioc .tag.hw { right: -40px; background: var(--c-blue); }
.life-ioc .place { position: absolute; left: 16px; top: 10px; width: 330px; height: 280px; border: 3px dashed var(--c-brand); border-radius: 22px; background: #f1fde6; }
.life-ioc .name { position: absolute; left: 14px; top: 10px; display: inline-flex; align-items: center; gap: 6px; padding: 2px 12px 2px 6px; border-radius: 999px; background: var(--c-brand); color: #fff; font-size: 14px; font-weight: 900; }
.life-ioc .clerk { position: absolute; right: 20px; top: 16px; }
.life-ioc .row { position: absolute; left: 14px; right: 14px; bottom: 16px; display: flex; justify-content: space-around; align-items: flex-end; }
.life-ioc .item { display: flex; flex-direction: column; align-items: center; }
.life-ioc .item b { font-size: 13.5px; }
.life-ioc .bubble { position: absolute; left: 470px; top: 44px; padding: 8px 14px; border: 3px solid var(--c-blue); border-radius: 16px 16px 4px 16px; background: #fff; color: var(--c-blue-dark); font-size: 16px; font-weight: 900; white-space: nowrap; }
.life-ioc .bubble.clerk-says { left: 360px; top: 112px; border-color: var(--c-brand); border-radius: 16px 16px 16px 4px; color: var(--c-brand-dark); }
</style>
