<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFixedSteps } from '../lib/steps'
import { usePoses, type Pose } from './poses'

// Animated comparison for chapter 4: who creates the printer, Teacher itself or the Spring container?
const props = withDefaults(defineProps<{ mode?: 'traditional' | 'ioc' }>(), { mode: 'traditional' })
const ioc = computed(() => props.mode === 'ioc')
const root = ref<HTMLElement>()
const { local, animated } = useFixedSteps(3)

const hidden: Pose = { opacity: 0, scale: 0.6 }
const traditional: Record<string, Pose[]> = {
  // HP is created by Teacher, breaks, and is thrown away
  hp: [{ x: 570, y: 62, ...hidden }, { x: 570, y: 62 }, { x: 570, y: 62, rotate: -8 }, { x: 620, y: 205, rotate: -20, opacity: 0.4, scale: 0.8 }],
  canon: [{ x: 570, y: 62, ...hidden }, { x: 570, y: 62, ...hidden }, { x: 570, y: 62, ...hidden }, { x: 570, y: 62 }],
  link: [{ opacity: 0 }, { opacity: 1 }, { opacity: 1 }, { opacity: 1 }],
}
const withContainer: Record<string, Pose[]> = {
  // beans wait inside the container; one of them is moved into Teacher's slot
  hp: [{ x: 60, y: 96 }, { x: 60, y: 96 }, { x: 610, y: 199 }, { x: 60, y: 96 }],
  canon: [{ x: 60, y: 196 }, { x: 60, y: 196 }, { x: 60, y: 196 }, { x: 610, y: 199 }],
  ask: [{ opacity: 0, x: 20 }, { opacity: 1, x: 0 }, { opacity: 0, x: 0 }, { opacity: 0, x: 0 }],
}
usePoses(root, local, ioc.value ? withContainer : traditional, animated)

const captions = computed(() => ioc.value
  ? ['Spring 容器預先準備好印表機，Teacher 手上還是空的', 'Teacher 只說「我需要一個 Printer」', 'Spring 容器把 HpPrinter 注入給 Teacher', '改 Spring 設定就能換成 Canon，Teacher 一行都沒改']
  : ['Teacher 想印講義，需要一台印表機', 'Teacher 自己 new 一台 HpPrinter，兩者綁在一起', 'HP 印表機壞了，想換成 Canon…', '只能打開 Teacher 改程式碼：每個用到的類別都要改'])
const codeLine = computed(() => {
  if (ioc.value) return 'private Printer printer;'
  return local.value >= 3 ? 'private Printer printer = new CanonPrinter();' : local.value >= 1 ? 'private Printer printer = new HpPrinter();' : 'private Printer printer = ???;'
})
</script>

<template>
  <div ref="root" class="anim-stage ioc-demo" :class="[mode, `s${local}`]">
    <div v-if="ioc" class="container-box">
      <span class="tag">Spring 容器</span>
      <small>預先建立、統一保管</small>
    </div>

    <div class="teacher" :class="{ changed: !ioc && local >= 3, ok: ioc && local >= 3 }">
      <span class="tag">Teacher</span>
      <code class="line">{{ codeLine }}</code>
      <div v-if="ioc" class="slot">{{ local >= 2 ? '' : 'Printer ?' }}</div>
      <span v-if="!ioc && local >= 3" class="badge bad">要改程式碼！</span>
      <span v-if="ioc && local >= 3" class="badge good">程式碼沒改 ✓</span>
    </div>

    <div v-if="ioc" class="ask" data-actor="ask">「我需要一個 Printer」</div>
    <div v-if="ioc && local >= 2" class="inject">注入</div>
    <div v-if="!ioc" class="link" data-actor="link">{{ local >= 1 ? '緊耦合' : '' }}</div>

    <div class="bean hp" data-actor="hp" :class="{ broken: !ioc && local >= 2 }">
      <b>HpPrinter</b><small>{{ !ioc && local >= 2 ? '壞掉了 ✕' : 'implements Printer' }}</small>
    </div>
    <div class="bean canon" data-actor="canon"><b>CanonPrinter</b><small>implements Printer</small></div>

    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.ioc-demo .container-box { position: absolute; left: 20px; top: 20px; width: 260px; height: 270px; padding: 12px 16px; border: 3px dashed var(--c-brand); border-radius: 22px; background: #f1fde6; }
.ioc-demo .container-box small { display: block; margin-top: 2px; color: var(--c-brand-dark); font-size: 13px; font-weight: 700; }
.ioc-demo .tag { display: inline-block; padding: 2px 12px; border-radius: 999px; background: var(--c-brand); color: #fff; font-size: 14px; font-weight: 900; }
.ioc-demo .teacher { position: absolute; left: 500px; top: 60px; width: 350px; height: 226px; padding: 14px 16px; border: 3px solid var(--c-blue); border-radius: 22px; box-shadow: 0 5px 0 var(--c-blue-dark); background: #fff; transition: border-color .3s, box-shadow .3s; }
.ioc-demo.traditional .teacher { left: 20px; top: 30px; height: 132px; width: 450px; }
.ioc-demo .teacher .tag { background: var(--c-blue); }
.ioc-demo .teacher .line { display: block; margin-top: 12px; padding: 6px 10px; border-radius: 9px; background: var(--c-blue-soft); color: #1478b8; font: 700 13px/1.5 var(--font-mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ioc-demo .teacher.changed { border-color: #ff4b4b; box-shadow: 0 5px 0 #d33131; }
.ioc-demo .teacher.changed .line { background: #ffdfe0; color: #c62828; }
.ioc-demo .teacher.ok { border-color: var(--c-brand); box-shadow: 0 5px 0 var(--c-brand-dark); }
.ioc-demo .slot { position: absolute; left: 100px; right: 16px; bottom: 14px; height: 72px; display: grid; place-items: center; border: 3px dashed var(--c-muted); border-radius: 16px; color: var(--c-muted); font-weight: 900; }
.ioc-demo .badge { position: absolute; top: -16px; right: 14px; padding: 3px 12px; border-radius: 999px; color: #fff; font-size: 14px; font-weight: 900; }
.ioc-demo .badge.bad { background: #ff4b4b; }
.ioc-demo .badge.good { background: var(--c-brand); }
.ioc-demo .bean { position: absolute; left: 0; top: 0; width: 216px; height: 68px; display: flex; flex-direction: column; justify-content: center; padding: 0 16px; border: 3px solid #ffc800; border-radius: 16px; box-shadow: 0 4px 0 #d9a600; background: #fff8dc; line-height: 1.3; }
.ioc-demo .bean b { font: 800 15px var(--font-mono); color: #2b2b2b; }
.ioc-demo .bean small { color: #8a6d00; font-size: 12px; font-weight: 700; }
.ioc-demo .bean.canon { border-color: #ce82ff; box-shadow: 0 4px 0 #a568cc; background: #f8eeff; }
.ioc-demo .bean.canon small { color: #7d3fb0; }
.ioc-demo .bean.broken { border-color: #ff4b4b; box-shadow: 0 4px 0 #d33131; background: #ffecec; }
.ioc-demo .bean.broken small { color: #c62828; }
.ioc-demo .link { position: absolute; left: 458px; top: 62px; width: 46px; height: 24px; border-top: 6px solid var(--c-ink); }
.ioc-demo.traditional .link { left: 470px; top: 93px; width: 100px; height: auto; padding-top: 8px; color: var(--c-ink); font-size: 14px; font-weight: 900; text-align: center; white-space: nowrap; }
.ioc-demo .ask { position: absolute; left: 296px; top: 74px; width: 196px; padding: 8px 10px; border: 3px solid var(--c-blue); border-radius: 16px 16px 16px 4px; background: #fff; color: var(--c-blue-dark); font-size: 14.5px; font-weight: 900; text-align: center; }
.ioc-demo .inject { position: absolute; left: 330px; top: 196px; width: 130px; padding-bottom: 4px; border-bottom: 6px solid var(--c-brand); color: var(--c-brand-dark); font-size: 15px; font-weight: 900; text-align: center; }
.ioc-demo .inject::after { content: ''; position: absolute; right: -4px; bottom: -13px; border: 10px solid transparent; border-left: 14px solid var(--c-brand); border-right: 0; }
</style>
