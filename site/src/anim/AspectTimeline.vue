<script setup lang="ts">
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch11: when the counter (aspect) does its work around one print job.
const { local, live } = useFixedSteps(3)
const at = (n: number) => !live.value || local.value >= n
const captions = [
  '一次列印，可以分成三段：印之前、印的時候、印完',
  '@Before：印之前，櫃台先收錢',
  '@After：印完之後，櫃台記帳',
  '@Around：從頭到尾站在旁邊，可以計時，還能決定放不放行',
]
</script>

<template>
  <div class="anim-stage aspect-timeline">
    <div class="around" :class="{ off: !at(3) }"><b>@Around</b>從頭到尾：計時、決定放不放行</div>
    <div class="zones">
      <div class="zone">
        <span class="name">印之前</span>
        <i class="tag before" :class="{ off: !at(1) }"><b>@Before</b>收錢</i>
      </div>
      <div class="zone main">
        <span class="name">印表機在印</span>
        <Art name="printer" size="88" />
        <code>print()</code>
      </div>
      <div class="zone">
        <span class="name">印完</span>
        <i class="tag after" :class="{ off: !at(2) }"><b>@After</b>記帳</i>
      </div>
    </div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.aspect-timeline .off { opacity: 0; transform: translateY(8px); }
.aspect-timeline .around { position: absolute; left: 40px; right: 40px; top: 4px; display: flex; align-items: center; justify-content: center; gap: 12px; height: 52px; border: 3px solid #ce82ff; border-bottom: 0; border-radius: 22px 22px 0 0; background: #faf2ff; color: #7d3fb0; font-size: 16px; font-weight: 900; transition: opacity .35s, transform .35s; }
.aspect-timeline .around b { padding: 2px 12px; border-radius: 999px; background: #ce82ff; color: #fff; font-size: 15px; }
.aspect-timeline .zones { position: absolute; left: 40px; right: 40px; top: 56px; display: grid; grid-template-columns: 1fr 1.3fr 1fr; gap: 14px; }
.aspect-timeline .zone { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; height: 200px; border: 3px dashed var(--c-line); border-radius: 20px; background: #fff; }
.aspect-timeline .zone.main { border: 3px solid var(--c-blue); background: #f2fbff; }
.aspect-timeline .name { position: absolute; top: 10px; padding: 2px 12px; border-radius: 999px; background: var(--c-polar); color: var(--c-ink-soft); font-size: 14px; font-weight: 900; }
.aspect-timeline .main .name { background: var(--c-blue); color: #fff; }
.aspect-timeline code { padding: 0 8px; border-radius: 7px; background: var(--c-blue-soft); color: #1478b8; font: 700 13px/1.6 var(--font-mono); }
.aspect-timeline .tag { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 22px; border-radius: 18px; font-size: 18px; font-style: normal; font-weight: 900; transition: opacity .35s, transform .35s; }
.aspect-timeline .tag b { font-size: 14px; padding: 1px 10px; border-radius: 999px; color: #fff; }
.aspect-timeline .tag.before { background: #fff3c4; color: #8a6d00; border: 3px solid #ffc800; }
.aspect-timeline .tag.before b { background: #d9a600; }
.aspect-timeline .tag.after { background: var(--c-blue-soft); color: var(--c-blue-dark); border: 3px solid #84d8ff; }
.aspect-timeline .tag.after b { background: var(--c-blue-dark); }
</style>
