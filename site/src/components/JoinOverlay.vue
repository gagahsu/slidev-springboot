<script setup lang="ts">
import { computed } from 'vue'
import { room, studentLink } from '../lib/room'
import QrCode from './QrCode.vue'

// Shown on top of the slide while the presenter invites students to join (not on devices that already joined).
const code = computed(() => room.joinCode || room.code)
const link = computed(() => studentLink(code.value))
const pretty = computed(() => `${code.value.slice(0, 4)} ${code.value.slice(4)}`)
</script>

<template>
  <div v-if="room.showJoin && code && (room.status !== 'on' || room.canControl)" class="join-overlay">
    <div class="card">
      <QrCode class="code-img" :text="link" />
      <div class="info">
        <small>用手機掃描，跟著老師一起看</small>
        <strong>加入課堂</strong>
        <p>或在首頁按「加入課堂」，輸入代碼</p>
        <b class="code">{{ pretty }}</b>
      </div>
    </div>
  </div>
</template>

<style scoped>
.join-overlay { position: absolute; inset: 0; z-index: 30; display: grid; place-items: center; background: rgba(19, 31, 36, .78); }
.card { display: flex; align-items: center; gap: 4vmin; padding: 4vmin; border-radius: 3vmin; background: #fff; box-shadow: 0 1vmin 0 rgba(0, 0, 0, .25); }
.code-img { width: 38vmin; max-width: 420px; }
.info { display: flex; flex-direction: column; max-width: 46vmin; }
.info small { color: var(--c-brand-dark); font-size: 2.2vmin; font-weight: 900; }
.info strong { font-size: 6.4vmin; font-weight: 900; line-height: 1.2; color: #2b2b2b; }
.info p { margin: 1.4vmin 0 .8vmin; color: var(--c-ink-soft); font-size: 2.2vmin; font-weight: 700; }
.code { align-self: flex-start; padding: .6vmin 2.2vmin; border-radius: 1.6vmin; background: var(--c-blue-soft); color: var(--c-blue-dark); font: 900 5.4vmin/1.3 var(--font-mono); letter-spacing: .08em; }
</style>
