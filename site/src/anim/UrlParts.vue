<script setup lang="ts">
import { computed } from 'vue'
import { useSteps } from '../lib/steps'
import { onMounted } from 'vue'

/**
 * Takes a URL apart, one segment per step.
 *   <UrlParts parts="http://;;Protocol;;溝通方式;;說明||localhost;;Host;;哪一間店;;說明" />
 * Each part: text ;; programming name ;; story name ;; one-line explanation.
 */
const props = defineProps<{ parts: string }>()
const items = computed(() => props.parts.split('||').map((p) => {
  const [text, name, story, note] = p.split(';;').map(s => s.trim())
  return { text, name, story, note }
}))
const s = useSteps()
onMounted(() => s.claim(items.value.length))
const { local, live } = s
const shown = (n: number) => !live.value || local.value > n
const active = computed(() => Math.min(local.value, items.value.length) - 1)
</script>

<template>
  <div class="anim-stage url-parts">
    <div class="url">
      <div v-for="(p, n) in items" :key="n" class="seg" :class="[`c${n % 5}`, { on: shown(n), now: live && active === n }]">
        <code>{{ p.text }}</code>
        <b>{{ p.name }}</b>
        <span>{{ p.story }}</span>
      </div>
    </div>
    <p v-if="active >= 0" class="caption"><span>{{ active + 1 }}</span>{{ items[active].note }}</p>
    <p v-else class="caption">一個網址，可以拆成 {{ items.length }} 段來讀</p>
  </div>
</template>

<style>
.slide .url-parts { height: 300px; }
.url-parts .url { position: absolute; left: 0; right: 0; top: 40px; display: flex; justify-content: center; gap: 4px; }
.url-parts .seg { display: flex; flex-direction: column; align-items: center; --c: #afafaf; --bg: #f7f7f7; }
.url-parts .seg.on.c0 { --c: #1cb0f6; --bg: #ddf4ff; }
.url-parts .seg.on.c1 { --c: #ce82ff; --bg: #f6e9ff; }
.url-parts .seg.on.c2 { --c: #ff9600; --bg: #fff0d9; }
.url-parts .seg.on.c3 { --c: #58cc02; --bg: #e5f9d3; }
.url-parts .seg.on.c4 { --c: #ff4b4b; --bg: #ffe3e3; }
.url-parts .seg code { padding: 8px 6px; border: 3px solid var(--c); border-radius: 12px; background: var(--bg); color: #2b2b2b; font: 800 25px/1.3 var(--font-mono); white-space: nowrap; transition: border-color .3s, background-color .3s, transform .3s; }
.url-parts .seg.now code { transform: translateY(-6px); box-shadow: 0 6px 0 var(--c); }
.url-parts .seg b, .url-parts .seg span { visibility: hidden; white-space: nowrap; }
.url-parts .seg.on b, .url-parts .seg.on span { visibility: visible; }
.url-parts .seg b { margin-top: 16px; color: var(--c); font-size: 16px; font-weight: 900; filter: brightness(.8); }
.url-parts .seg span { margin-top: 4px; padding: 2px 10px; border-radius: 999px; background: var(--bg); color: #2b2b2b; font-size: 14.5px; font-weight: 800; }
</style>
