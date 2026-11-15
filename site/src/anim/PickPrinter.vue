<script setup lang="ts">
import { ref } from 'vue'
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'
import { usePoses } from './poses'

// ch07 story: the store has two printers; "a printer" is not enough, 小明 has to name the one he wants.
const root = ref<HTMLElement>()
const { local, animated } = useFixedSteps(3)

usePoses(root, local, {
  ask: [{ opacity: 0, y: 10 }, { opacity: 1, y: 0 }, { opacity: 1 }, { opacity: 0 }],
  pick: [{ opacity: 0, y: 10 }, { opacity: 0 }, { opacity: 0 }, { opacity: 1, y: 0 }],
  what: [{ opacity: 0, scale: 0.4 }, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.4 }],
  canon: [{ x: 196, y: 150 }, { x: 196, y: 150 }, { x: 196, y: 150 }, { x: 690, y: 168 }],
}, animated)

const captions = [
  '店裡現在有兩台印表機：HP 和 Canon',
  '小明說：「請給我一台印表機」',
  '兩台都是印表機，店員不知道要給哪一台，卡住了',
  '小明指名「編號 canonPrinter 那台」，店員馬上就找到了',
]
</script>

<template>
  <div ref="root" class="anim-stage pick-printer" :class="`s${local}`">
    <div class="place">
      <span class="name"><Art name="store" size="30" />便利商店</span>
      <div class="clerk"><Art name="clerk" size="76" /></div>
      <div class="what" data-actor="what"><Art name="what" size="54" /></div>
    </div>
    <div class="machine" style="left: 46px; top: 150px"><Art name="printer" size="80" /><b>HP 印表機</b><code>hpPrinter</code></div>
    <div class="machine" data-actor="canon"><Art name="printer2" size="80" /><b>Canon 印表機</b><code>canonPrinter</code></div>
    <div class="me"><Art name="you" size="120" /><b>小明</b></div>
    <div class="bubble" data-actor="ask">「請給我一台印表機」</div>
    <div class="bubble pick" data-actor="pick">「我要 canonPrinter 那台」</div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.pick-printer b { font-size: 14.5px; font-weight: 900; color: #2b2b2b; line-height: 1.4; }
.pick-printer .place { position: absolute; left: 16px; top: 10px; width: 330px; height: 280px; border: 3px dashed var(--c-brand); border-radius: 22px; background: #f1fde6; }
.pick-printer .name { position: absolute; left: 14px; top: 10px; display: inline-flex; align-items: center; gap: 6px; padding: 2px 12px 2px 6px; border-radius: 999px; background: var(--c-brand); color: #fff; font-size: 14px; font-weight: 900; }
.pick-printer .clerk { position: absolute; right: 22px; top: 16px; }
.pick-printer .what { position: absolute; right: 96px; top: 6px; animation: pick-wobble .5s ease-in-out infinite alternate; }
@keyframes pick-wobble { from { rotate: -10deg; } to { rotate: 10deg; } }
.pick-printer .machine { position: absolute; left: 0; top: 0; display: flex; flex-direction: column; align-items: center; width: 130px; }
.pick-printer .machine code { margin-top: 2px; padding: 0 8px; border-radius: 7px; background: #fff5cc; border: 2px solid #ffc800; color: #8a6d00; font: 700 12px/1.5 var(--font-mono); }
.pick-printer .me { position: absolute; left: 720px; top: 10px; display: flex; flex-direction: column; align-items: center; }
.pick-printer .bubble { position: absolute; left: 440px; top: 40px; padding: 8px 14px; border: 3px solid var(--c-blue); border-radius: 16px 16px 4px 16px; background: #fff; color: var(--c-blue-dark); font-size: 16px; font-weight: 900; white-space: nowrap; }
.pick-printer .bubble.pick { left: 420px; }
</style>
