<script setup lang="ts">
import { computed } from 'vue'
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch14 story: every clerk wears a badge saying which item they handle; the host reads the
// item on the order slip and hands it to the clerk with that badge. Nobody has it -> 404.
// `terms` shows the badge as @RequestMapping("…") and the clerk as a method name.
defineProps<{ terms?: boolean }>()
const { local, live } = useFixedSteps(3)
const clerks = [
  { path: '/milktea', name: '做珍珠奶茶', method: 'milkTea()' },
  { path: '/greentea', name: '做綠茶', method: 'greenTea()' },
  { path: '/blacktea', name: '做紅茶', method: 'blackTea()' },
]
const orders = ['', '/milktea', '/greentea', '/coffee']
const step = computed(() => (live.value ? local.value : 3))
const order = computed(() => orders[step.value])
const hit = computed(() => clerks.findIndex(c => c.path === order.value))
const captions = ['三位店員，身上各掛一張「我負責的品項」', '點單寫 /milktea：交給掛著 /milktea 的店員', '點單寫 /greentea：交給掛著 /greentea 的店員', '點單寫 /coffee：沒有人掛這張牌，本店沒有賣']
</script>

<template>
  <div class="anim-stage dispatch" :class="{ miss: step === 3 }">
    <div class="slip" :class="{ off: !order }">
      <Art name="form" size="56" />
      <small>點單上的品項</small>
      <code>{{ order || '/milktea' }}</code>
    </div>
    <div class="host">
      <Art name="staff" size="78" />
      <b>接待</b>
      <small>看品項，找店員</small>
    </div>
    <div class="clerks">
      <div v-for="(c, n) in clerks" :key="n" class="clerk" :class="{ hit: hit === n, dim: step > 0 && hit !== n }">
        <code class="badge">{{ terms ? `@RequestMapping("${c.path}")` : c.path }}</code>
        <Art name="clerk" size="72" />
        <b>{{ c.name }}</b>
        <small v-if="terms">{{ c.method }}</small>
      </div>
    </div>
    <b v-if="step === 3" class="nf">404　找不到負責的店員</b>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[step] }}</p>
  </div>
</template>

<style>
.dispatch b { font-weight: 900; color: #2b2b2b; font-size: 15px; }
.dispatch small { color: var(--c-ink-soft); font-size: 12.5px; font-weight: 800; }
.dispatch .off { visibility: hidden; }
.dispatch .slip { position: absolute; left: 0; top: 60px; display: flex; flex-direction: column; align-items: center; width: 150px; padding: 10px 6px 12px; border: 3px solid #ffc800; border-radius: 18px; box-shadow: 0 4px 0 #e0ad00; background: #fffbea; }
.dispatch .slip code { margin-top: 4px; padding: 2px 10px; border-radius: 8px; background: #fff; color: #2b2b2b; font: 800 17px/1.5 var(--font-mono); }
.dispatch.miss .slip { border-color: #ff4b4b; box-shadow: 0 4px 0 #d33131; background: #fff1f1; }
.dispatch .host { position: absolute; left: 176px; top: 74px; display: flex; flex-direction: column; align-items: center; width: 120px; }
.dispatch .clerks { position: absolute; left: 330px; top: 30px; display: flex; gap: 14px; }
.dispatch .clerk { position: relative; display: flex; flex-direction: column; align-items: center; width: 172px; height: 176px; padding: 34px 6px 10px; border: 3px solid var(--c-line); border-radius: 20px; box-shadow: 0 4px 0 var(--c-line); background: #fff; transition: border-color .3s, box-shadow .3s, opacity .3s, transform .3s; }
.dispatch .clerk.hit { border-color: var(--c-brand); box-shadow: 0 4px 0 var(--c-brand-dark); background: #f1ffe4; transform: translateY(-6px); }
.dispatch .clerk.dim { opacity: .45; }
.dispatch .badge { position: absolute; top: -15px; padding: 3px 10px; border-radius: 999px; background: #ce82ff; color: #fff; font: 800 13.5px/1.5 var(--font-mono); white-space: nowrap; }
.dispatch .clerk.hit .badge { background: var(--c-brand); }
.dispatch .nf { position: absolute; left: 330px; width: 544px; top: 232px; padding: 4px 0; border-radius: 999px; background: #ff4b4b; color: #fff; font-size: 16px; text-align: center; }
</style>
