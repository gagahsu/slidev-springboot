<script setup lang="ts">
import { computed } from 'vue'
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch46 story: when the other office stops answering, keep calling only makes everyone wait.
// Hang a "service suspended" sign (circuit breaker): closed -> open -> half-open.
defineProps<{ terms?: boolean }>()
const { local, live } = useFixedSteps(3)
const captions = ['平常：學籍組打內線給社團組，都接得通', '社團組出狀況，電話一直沒人接。每一通都要等很久', '失敗太多次，掛上「暫停服務」的牌子：不再打電話，直接回覆備用答案', '過一段時間，試打幾通。接通了就拿下牌子；還是不通，就繼續掛著']
const state = computed(() => (!live.value ? 0 : [0, 0, 1, 2][local.value]))
</script>

<template>
  <div class="anim-stage breaker">
    <div class="top">
      <div class="office"><Art name="cabinet" size="38" /><b>學籍組</b></div>
      <div class="wire" :class="'w' + (live ? local : 0)">
        <i v-if="!live || local === 0">☎ 接通 ✓</i>
        <i v-else-if="local === 1">☎ 沒人接 ✗ ✗ ✗</i>
        <i v-else-if="local === 2">🚫 暫停服務，直接回覆備用答案<em v-if="terms">fallback</em></i>
        <i v-else>☎ 試打幾通 …</i>
      </div>
      <div class="office" :class="{ down: live && local >= 1 }"><Art name="cabinet" size="38" /><b>社團組</b></div>
    </div>
    <div class="states">
      <div class="st" :class="{ on: state === 0 }"><b>正常<em v-if="terms">CLOSED</em></b><small>每一通都照常打</small></div>
      <div class="st" :class="{ on: state === 1 }"><b>暫停服務<em v-if="terms">OPEN</em></b><small>不打了，直接給備用答案</small></div>
      <div class="st" :class="{ on: state === 2 }"><b>試試看<em v-if="terms">HALF_OPEN</em></b><small>放幾通過去，看好了沒</small></div>
    </div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.breaker em { margin-left: 6px; padding: 0 8px; border-radius: 999px; background: #2f4550; color: #fff; font: 800 12px/1.7 var(--font-mono); font-style: normal; white-space: nowrap; }
.breaker .off { visibility: hidden; }
.breaker i { font-style: normal; }
.breaker .top { position: absolute; left: 0; right: 0; top: 10px; display: flex; align-items: center; gap: 12px; }
.breaker .office { flex: none; width: 150px; display: flex; align-items: center; gap: 8px; padding: 8px 12px; border: 3px solid var(--c-brand); border-radius: 16px; background: #f1ffe4; box-shadow: 0 4px 0 var(--c-brand-dark); transition: all .3s; }
.breaker .office.down { border-color: #9aa7ad; background: #eef1f3; box-shadow: 0 4px 0 #6f7c83; }
.breaker .office b { font-size: 15.5px; font-weight: 900; color: #2b2b2b; white-space: nowrap; }
.breaker .wire { flex: 1; text-align: center; padding: 6px 10px; border-radius: 999px; border: 3px solid #1cb0f6; background: #e8f7ff; color: #1378a8; font-size: 15px; font-weight: 900; white-space: nowrap; }
.breaker .wire.w1, .breaker .wire.w2 { border-color: #ff4b4b; background: #fff0f0; color: #c62828; }
.breaker .wire.w3 { border-color: #ffc800; background: #fff9db; color: #8a6d00; }
.breaker .states { position: absolute; left: 0; right: 0; top: 118px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.breaker .st { padding: 12px 14px; border: 3px solid #dfe6ea; border-radius: 16px; background: #fff; opacity: .55; transition: all .3s; }
.breaker .st.on { opacity: 1; border-color: #ffc800; background: #fff9db; box-shadow: 0 4px 0 #cd9f00; }
.breaker .st b { display: block; font-size: 16.5px; font-weight: 900; color: #2b2b2b; white-space: nowrap; }
.breaker .st small { display: block; margin-top: 4px; font-size: 13.5px; font-weight: 800; color: #5d6b74; }
</style>
