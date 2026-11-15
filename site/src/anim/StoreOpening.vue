<script setup lang="ts">
import { animate } from 'motion'
import { computed, onMounted, ref, watch } from 'vue'
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch08 story: a printer is placed in the store (Bean created), prepared before opening (initialised), then used.
const root = ref<HTMLElement>()
const { local, live, animated } = useFixedSteps(3)
const left = computed(() => (local.value >= 3 ? 3 : local.value >= 2 ? 4 : 5))
const shown = (n: number) => !live.value || local.value >= n

const captions = [
  '店家把印表機擺進店裡，可是紙匣還是空的',
  '開店前，店員先開機、放進 5 張紙',
  '開門營業，小明印了一張，剩下 4 張',
  '每印一張，剩下的張數就少一張',
]

onMounted(() => {
  watch(local, (now, before) => {
    if (!animated()) return
    const card = root.value?.querySelectorAll<HTMLElement>('.card')[now]
    if (now > before && card && now <= 2) animate(card, { opacity: [0, 1], y: [16, 0] }, { type: 'spring', stiffness: 240, damping: 22 })
    const badge = root.value?.querySelector<HTMLElement>('.card.use .left')
    if (now >= 2 && badge) animate(badge, { scale: [1.35, 1] }, { duration: 0.35 })
  })
})
</script>

<template>
  <div ref="root" class="anim-stage store-opening">
    <div class="card">
      <span class="tag">① 擺進店裡</span>
      <Art name="printer" size="96" />
      <b>店裡多了一台印表機</b>
      <small>紙匣：空的</small>
    </div>
    <i class="arrow" :class="{ off: !shown(1) }" />
    <div class="card prep" :class="{ off: !shown(1) }">
      <span class="tag">② 開店前的準備</span>
      <Art name="paper" size="96" />
      <b>開機、放進 5 張紙</b>
      <small class="left">剩 5 張</small>
    </div>
    <i class="arrow" :class="{ off: !shown(2) }" />
    <div class="card use" :class="{ off: !shown(2) }">
      <span class="tag">③ 開門營業</span>
      <Art name="you" size="96" />
      <b>小明來印作業</b>
      <small class="left">剩 {{ left }} 張</small>
    </div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.store-opening { display: flex; align-items: flex-start; justify-content: center; gap: 0; padding-top: 6px; }
.store-opening .card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; width: 236px; height: 250px; padding: 34px 14px 14px; border: 3px solid var(--c-line); border-radius: 22px; box-shadow: 0 5px 0 var(--c-line); background: #fff; transition: opacity .3s; }
.store-opening .card.prep { border-color: #ffc800; box-shadow: 0 5px 0 #d9a600; background: #fffbea; }
.store-opening .card.use { border-color: var(--c-blue); box-shadow: 0 5px 0 var(--c-blue-dark); background: #f2fbff; }
.store-opening .card.off, .store-opening .arrow.off { opacity: 0; }
.store-opening .tag { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); padding: 3px 14px; border-radius: 999px; background: var(--c-ink-soft); color: #fff; font-size: 14px; font-weight: 900; white-space: nowrap; }
.store-opening .prep .tag { background: #d9a600; }
.store-opening .use .tag { background: var(--c-blue-dark); }
.store-opening b { margin-top: 6px; font-size: 17px; font-weight: 900; color: #2b2b2b; text-align: center; }
.store-opening small { padding: 2px 12px; border-radius: 999px; background: var(--c-polar); color: var(--c-ink-soft); font-size: 14px; font-weight: 800; }
.store-opening small.left { background: var(--c-brand); color: #fff; font-size: 16px; }
.store-opening .arrow { align-self: center; width: 46px; height: 6px; margin: 0 8px; border-radius: 3px; background: var(--c-muted); position: relative; transition: opacity .3s; }
.store-opening .arrow::after { content: ''; position: absolute; right: -6px; top: -7px; border: 10px solid transparent; border-left: 12px solid var(--c-muted); border-right: 0; }
</style>
