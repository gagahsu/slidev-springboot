<script setup lang="ts">
import { ref } from 'vue'
import { createRoom, isLocalAddress, leaveRoom, remoteLink, room, setShowJoin, studentLink } from '../lib/room'
import Icon from './Icon.vue'
import QrCode from './QrCode.vue'

const emit = defineEmits<{ close: [] }>()
const showRemote = ref(false)
const copied = ref('')
const local = isLocalAddress()

async function copy(text: string, what: string) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = what
    setTimeout(() => { copied.value = '' }, 1600)
  }
  catch {}
}
</script>

<template>
  <div class="overlay room-overlay" @click.self="emit('close')" @keydown.esc.stop="emit('close')">
    <div class="panel" role="dialog" aria-label="遠端課堂">
      <header>
        <strong>遠端課堂</strong>
        <button class="btn square" aria-label="關閉" @click="emit('close')"><Icon name="x" /></button>
      </header>

      <div v-if="room.status === 'off' || room.status === 'error'" class="body">
        <p>開一個房間，讓其他裝置透過網路跟這台同步：</p>
        <ul>
          <li><b>學生</b>用手機掃 QR code，畫面跟著你翻頁，還能投票、提問。</li>
          <li><b>你的手機</b>可以當遙控器，看講稿、翻頁。</li>
        </ul>
        <p v-if="room.error" class="warn" role="alert">{{ room.error }}</p>
        <button class="btn primary" @click="createRoom()"><Icon name="wifi" />建立房間</button>
      </div>

      <div v-else-if="room.status === 'connecting'" class="body"><p>連線中…</p></div>

      <div v-else class="body">
        <p v-if="local" class="warn">目前網址是 localhost，只有這台電腦打得開，手機掃了 QR code 也連不上。把網站部署到公開網址後再用這個功能。</p>
        <div class="grid">
          <section>
            <h4>學生加入</h4>
            <QrCode class="qrbox" :text="studentLink()" />
            <b class="code">{{ room.code.slice(0, 4) }} {{ room.code.slice(4) }}</b>
            <button class="btn" @click="copy(studentLink(), 'student')"><Icon :name="copied === 'student' ? 'check' : 'qr'" />{{ copied === 'student' ? '已複製' : '複製連結' }}</button>
            <button class="btn" :class="{ on: room.showJoin }" :aria-pressed="room.showJoin" @click="setShowJoin(!room.showJoin)">
              <Icon name="present" />{{ room.showJoin ? '從投影片收起 QR' : '在投影片上顯示 QR' }}
            </button>
          </section>
          <section>
            <h4>手機遙控</h4>
            <template v-if="showRemote">
              <QrCode class="qrbox" :text="remoteLink()" />
              <button class="btn" @click="copy(remoteLink(), 'remote')"><Icon :name="copied === 'remote' ? 'check' : 'qr'" />{{ copied === 'remote' ? '已複製' : '複製連結' }}</button>
            </template>
            <button v-else class="btn" @click="showRemote = true"><Icon name="qr" />顯示遙控 QR</button>
            <p class="hint">這個 QR 帶有控制權，拿到的人可以翻你的投影片。只給自己的裝置掃，不要投影出去。</p>
          </section>
        </div>
        <footer>
          <span class="people"><i />{{ room.people }} 個裝置在線</span>
          <button class="btn" @click="leaveRoom()">關閉房間</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.room-overlay { z-index: 70; display: grid; place-items: center; padding: 16px; color: var(--c-ink); }
.panel { width: min(680px, 100%); max-height: 92vh; overflow-y: auto; border: 2px solid var(--c-line); border-radius: 20px; background: var(--c-snow); }
header { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px 12px 20px; border-bottom: 2px solid var(--c-line); font-size: 19px; font-weight: 900; }
.body { padding: 18px 20px 20px; font-size: 15.5px; font-weight: 600; line-height: 1.7; }
.body p { margin: 0 0 10px; }
.body ul { margin: 0 0 16px; padding-left: 1.3em; list-style: disc; }
.warn { padding: 8px 12px; border-radius: 12px; background: #fff2d6; color: #8a5200; font-weight: 700; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
section { display: flex; flex-direction: column; align-items: stretch; gap: 10px; padding: 14px; border: 2px solid var(--c-line); border-radius: 16px; }
h4 { margin: 0; font-size: 16px; font-weight: 900; }
.qrbox { width: 100%; max-width: 220px; margin: 0 auto; border: 2px solid var(--c-line); border-radius: 12px; overflow: hidden; }
.code { align-self: center; padding: 2px 14px; border-radius: 10px; background: var(--c-blue-soft); color: var(--c-blue-dark); font: 900 24px/1.4 var(--font-mono); letter-spacing: .08em; }
.hint { margin: 0; color: var(--c-ink-soft); font-size: 13px; line-height: 1.6; }
.btn.on { border-color: #84d8ff; box-shadow: 0 3px 0 #84d8ff; background: var(--c-blue-soft); color: var(--c-blue-dark); }
footer { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; }
.people { display: flex; align-items: center; gap: 8px; font-weight: 800; color: var(--c-brand-dark); }
.people i { width: 10px; height: 10px; border-radius: 50%; background: var(--c-brand); }
@media (max-width: 560px) { .grid { grid-template-columns: 1fr; } }
</style>
