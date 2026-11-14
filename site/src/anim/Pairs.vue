<script setup lang="ts">
import { animate } from 'motion'
import { computed, onMounted, ref, watch } from 'vue'
import { useSteps } from '../lib/steps'
import Art from './Art.vue'

/**
 * "Everyday thing = programming term" table, one row per step.
 *   <Pairs left="住飯店" right="寫程式" rows="you,你=teacher,Teacher 類別|hotel,飯店=spring,Spring 容器" />
 * Each side is `插圖名稱,文字`; the illustration name may be left out (`,文字`).
 */
const props = defineProps<{ left?: string, right?: string, rows: string }>()
const rows = computed(() => props.rows.split('|').map((r) => {
  const side = (s: string) => {
    const at = s.indexOf(',')
    return at < 0 ? { art: '', text: s.trim() } : { art: s.slice(0, at).trim(), text: s.slice(at + 1).trim() }
  }
  const [l, r2 = ''] = r.split('=')
  return { l: side(l), r: side(r2) }
}))
const root = ref<HTMLElement>()
const { local, live, animated, claim } = useSteps()

onMounted(() => {
  claim(rows.value.length)
  watch(local, (now, before) => {
    if (now <= before || !animated()) return
    const el = root.value?.querySelectorAll<HTMLElement>('.pair')[now - 1]
    if (!el) return
    animate(el.querySelector('.l')!, { opacity: [0, 1], x: [-24, 0] }, { type: 'spring', stiffness: 240, damping: 22 })
    animate(el.querySelector('.eq')!, { opacity: [0, 1], scale: [0.3, 1] }, { delay: 0.25, duration: 0.3 })
    animate(el.querySelector('.r')!, { opacity: [0, 1], x: [24, 0] }, { type: 'spring', stiffness: 240, damping: 22, delay: 0.4 })
  })
})
</script>

<template>
  <div ref="root" class="pairs">
    <div v-if="left || right" class="heads"><b>{{ left }}</b><i /><b class="code">{{ right }}</b></div>
    <div v-for="(row, n) in rows" :key="n" class="pair" :class="{ 'step-hidden': live && n >= local }">
      <div class="l"><Art v-if="row.l.art" :name="row.l.art" size="44" /><span>{{ row.l.text }}</span></div>
      <div class="eq">=</div>
      <div class="r"><Art v-if="row.r.art" :name="row.r.art" size="44" /><span>{{ row.r.text }}</span></div>
    </div>
  </div>
</template>

<style>
.slide .pairs { display: grid; gap: 9px; margin: 12px 0; }
.slide .pairs .heads, .slide .pairs .pair { display: grid; grid-template-columns: 1fr 44px 1fr; align-items: center; gap: 10px; }
.slide .pairs .heads b { padding: 2px 0; border-radius: 999px; background: #ffeccf; color: #a35f00; font-size: 14.5px; font-weight: 900; text-align: center; }
.slide .pairs .heads b.code { background: var(--c-blue-soft); color: var(--c-blue-dark); }
.slide .pairs .l, .slide .pairs .r { display: flex; align-items: center; gap: 12px; min-height: 58px; padding: 6px 16px; border: 2px solid #ffc800; border-radius: 16px; box-shadow: 0 3px 0 #d9a600; background: #fffbea; font-size: 18px; font-weight: 800; color: #2b2b2b; line-height: 1.35; }
.slide .pairs .r { border-color: var(--c-blue); box-shadow: 0 3px 0 var(--c-blue-dark); background: #f2fbff; }
.slide .pairs .eq { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: var(--c-brand); color: #fff; font-size: 24px; font-weight: 900; line-height: 1; }
</style>
