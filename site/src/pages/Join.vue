<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { joinRoom, room } from '../lib/room'
import { chapterById, legacyCourse } from '../lib/deck'
import { on } from '../lib/sync'

// Landing page of the join links: connects to the room, then goes wherever the presenter is.
const route = useRoute()
const router = useRouter()
const slow = ref(false)
let off: (() => void) | undefined
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(async () => {
  document.title = '加入課堂'
  off = on('nav', (m, _e, origin) => {
    if (!origin.remote) return
    const course = m.course ?? legacyCourse?.id ?? ''
    if (!chapterById(course, m.ch)) return
    room.presenterAt = { course, ch: m.ch, i: m.i, step: m.step ?? 0 }
    router.replace(`${room.canControl ? '/presenter' : ''}/${course}/${m.ch}/${m.i + 1}`)
  })
  timer = setTimeout(() => { slow.value = true }, 7000)
  await joinRoom(String(route.params.code), String(route.params.key ?? ''))
})
onBeforeUnmount(() => { off?.(); clearTimeout(timer) })
</script>

<template>
  <main class="join">
    <div class="box">
      <span class="logo" aria-hidden="true">S</span>
      <h1>加入課堂</h1>
      <p v-if="room.status === 'error'" class="err" role="alert">{{ room.error }}</p>
      <p v-else-if="room.status !== 'on'">連線中…</p>
      <p v-else-if="!slow">已連線，正在找老師目前的頁面…</p>
      <p v-else>已連線，但老師還沒開始，或房間代碼不正確。這個畫面會一直等，老師一翻頁就會自動跟上。</p>
      <b class="code">{{ room.code.slice(0, 4) }} {{ room.code.slice(4) }}</b>
      <RouterLink class="btn" to="/">先回課程目錄</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.join { display: grid; place-items: center; min-height: 100%; padding: 20px; background: var(--c-polar); }
.box { display: flex; flex-direction: column; align-items: center; gap: 12px; width: min(420px, 100%); padding: 30px 24px; border: 2px solid var(--c-line); border-radius: 22px; box-shadow: 0 4px 0 var(--c-line); background: var(--c-snow); text-align: center; }
.logo { display: grid; place-items: center; width: 60px; height: 60px; border-radius: 18px; background: var(--c-brand); box-shadow: 0 5px 0 var(--c-brand-dark); color: #fff; font-size: 34px; font-weight: 900; }
h1 { margin: 6px 0 0; font-size: 26px; font-weight: 900; color: #2b2b2b; }
p { margin: 0; color: var(--c-ink-soft); font-size: 15.5px; font-weight: 700; line-height: 1.7; }
.err { color: #c62828; }
.code { padding: 2px 16px; border-radius: 12px; background: var(--c-blue-soft); color: var(--c-blue-dark); font: 900 26px/1.4 var(--font-mono); letter-spacing: .08em; }
</style>
