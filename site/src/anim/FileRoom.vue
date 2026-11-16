<script setup lang="ts">
import { computed } from 'vue'
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch22 story (school registrar's office).
//   mode="lost": the clerk keeps a student's record in her head; after closing time it is gone,
//                so the office needs a file room (= database).
//   mode="room": teacher -> front desk -> runner -> file room and back. `terms` adds the
//                programming names (前端 / Spring MVC / Spring JDBC / 資料庫).
const props = defineProps<{ mode?: 'lost' | 'room', terms?: boolean }>()
const lost = computed(() => props.mode === 'lost')
const { local, live } = useFixedSteps(lost.value ? 3 : 4)
const at = (n: number) => !live.value || local.value >= n
const captions = computed(() => lost.value
  ? ['老師請教務處記下一位新同學的資料，承辦人員先記在腦子裡', '下班了，辦公室關燈', '隔天老師來問，承辦人員已經想不起來', '所以要有檔案室：資料寫下來放進去，關燈也不會不見']
  : ['教務處有櫃台、承辦人員，後面還有一間檔案室', '老師到櫃台：「我要查 3 號同學的資料」', '櫃台把事情交給承辦人員，承辦人員走進檔案室', '承辦人員從檔案櫃找出那張資料卡', '資料卡一路交回到老師手上'])
// where the card is in "room" mode: 0 hidden, 3 at cabinet, 4 back at teacher
const cardPos = computed(() => !live.value ? 'teacher' : local.value >= 4 ? 'teacher' : local.value >= 3 ? 'cabinet' : 'none')
const runnerIn = computed(() => live.value && (local.value === 2 || local.value === 3))
</script>

<template>
  <div v-if="lost" class="anim-stage file-room lost" :class="{ night: live && local === 1 }">
    <div class="who t"><Art name="teacher" size="78" /><b>老師</b></div>
    <i class="say s1" :class="{ off: live && local !== 0 }">「新同學小美，三年二班，請記一下」</i>
    <i class="say s2" :class="{ off: !(live && local === 2) }">「小美是哪一班？」</i>
    <div class="who c"><Art name="staff" size="78" /><b>承辦人員</b></div>
    <div class="think" :class="{ off: live && local >= 1 }"><Art name="card" size="46" /><span>小美<br>三年二班</span><em>記在腦子裡</em></div>
    <i class="say s3" :class="{ off: !(live && local === 2) }">「……我忘了」</i>
    <div class="moon" :class="{ off: !(live && local === 1) }">下班 · 關燈</div>
    <div class="room" :class="{ off: !at(3) }">
      <Art name="cabinet" size="96" />
      <b>檔案室</b>
      <div class="kept"><Art name="card" size="40" /><span>小美 · 三年二班</span></div>
    </div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
  <div v-else class="anim-stage file-room flow">
    <div class="zone z1" :class="{ hot: live && (local === 1 || local === 4) }">
      <Art name="teacher" size="74" /><b>老師</b><em v-if="terms">前端</em>
    </div>
    <i class="arrow a1" :class="{ on: at(1) }" />
    <div class="zone z2" :class="{ hot: live && (local === 1 || local === 2) }">
      <Art name="clerk" size="74" /><b>櫃台</b><em v-if="terms">Spring MVC</em>
    </div>
    <i class="arrow a2" :class="{ on: at(2) }" />
    <div class="zone z3" :class="{ hot: live && (local === 2 || local === 3), gone: runnerIn }">
      <Art name="staff" size="74" /><b>承辦人員</b><em v-if="terms">Spring JDBC</em>
    </div>
    <i class="arrow a3" :class="{ on: at(2) }" />
    <div class="zone z4" :class="{ hot: live && (local === 2 || local === 3) }">
      <Art name="cabinet" size="74" /><b>檔案室</b><em v-if="terms">資料庫</em>
      <span v-if="runnerIn" class="inside"><Art name="staff" size="40" /></span>
    </div>
    <i class="say ask" :class="{ off: !(live && local === 1) }">「我要查 3 號同學」</i>
    <div class="card" :class="cardPos"><Art name="card" size="44" /><span>3 號 · 小美</span></div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.file-room .off { visibility: hidden; }
.file-room i { font-style: normal; font-weight: 900; }
.file-room b { font-size: 15px; font-weight: 900; color: #2b2b2b; }
.file-room .say { position: absolute; padding: 6px 12px; border: 2px solid var(--c-blue); border-radius: 14px 14px 14px 2px; background: #fff; font-size: 15px; white-space: nowrap; }

/* lost */
.file-room.lost { transition: background-color .5s; border-radius: 20px; }
.file-room.lost.night { background: #2f4550; }
.file-room.lost.night b { color: #fff; }
.file-room.lost .who { position: absolute; top: 96px; display: flex; flex-direction: column; align-items: center; gap: 2px; width: 110px; }
.file-room.lost .t { left: 20px; }
.file-room.lost .c { left: 400px; }
.file-room.lost .s1, .file-room.lost .s2 { left: 60px; top: 40px; }
.file-room.lost .s3 { left: 430px; top: 40px; border-color: #ff4b4b; }
.file-room.lost .think { position: absolute; left: 500px; top: 26px; display: flex; align-items: center; gap: 6px; padding: 6px 14px 6px 8px; border: 2px dashed #ce82ff; border-radius: 22px; background: #faf2ff; font-size: 14px; font-weight: 800; line-height: 1.35; transition: opacity .4s; }
.file-room.lost .think em { position: absolute; left: 50%; bottom: -24px; transform: translateX(-50%); color: #7d3fb0; font-size: 12.5px; font-style: normal; font-weight: 900; white-space: nowrap; }
.file-room.lost .moon { position: absolute; left: 50%; top: 20px; transform: translateX(-50%); padding: 4px 18px; border-radius: 999px; background: #ffc800; color: #5c4700; font-size: 16px; font-weight: 900; }
.file-room.lost .room { position: absolute; right: 16px; top: 46px; display: flex; flex-direction: column; align-items: center; gap: 2px; width: 190px; padding: 12px 0 10px; border: 3px solid var(--c-brand); border-radius: 20px; box-shadow: 0 4px 0 var(--c-brand-dark); background: #f1ffe4; }
.file-room.lost .kept { display: flex; align-items: center; gap: 4px; font-size: 13.5px; font-weight: 900; color: var(--c-brand-dark); }

/* flow */
.file-room.flow .zone { position: absolute; top: 70px; display: flex; flex-direction: column; align-items: center; gap: 2px; width: 150px; height: 150px; padding-top: 14px; border: 3px solid var(--c-line); border-radius: 20px; box-shadow: 0 4px 0 var(--c-line); background: #fff; transition: border-color .3s, box-shadow .3s, background-color .3s; }
.file-room.flow .zone.hot { border-color: var(--c-blue); box-shadow: 0 4px 0 var(--c-blue-dark); background: #f2fbff; }
.file-room.flow .z1 { left: 0; } .file-room.flow .z2 { left: 242px; } .file-room.flow .z3 { left: 484px; } .file-room.flow .z4 { left: 726px; }
.file-room.flow .z3.gone > .art { opacity: .25; }
.file-room.flow .zone em { position: absolute; bottom: -34px; left: 50%; transform: translateX(-50%); padding: 2px 12px; border-radius: 999px; background: #2f4550; color: #fff; font: 800 13px/1.6 var(--font-mono); font-style: normal; white-space: nowrap; }
.file-room.flow .inside { position: absolute; right: -6px; top: 48px; }
.file-room.flow .arrow { position: absolute; top: 142px; width: 70px; height: 6px; border-radius: 3px; background: var(--c-line); transition: background-color .3s; }
.file-room.flow .arrow.on { background: var(--c-blue); }
.file-room.flow .a1 { left: 161px; } .file-room.flow .a2 { left: 403px; } .file-room.flow .a3 { left: 645px; }
.file-room.flow .ask { left: 40px; top: 18px; }
.file-room.flow .card { position: absolute; top: 14px; display: flex; align-items: center; gap: 4px; padding: 2px 12px 2px 4px; border: 2px solid var(--c-brand); border-radius: 12px; background: #f1ffe4; font-size: 14px; font-weight: 900; color: var(--c-brand-dark); white-space: nowrap; transition: left .8s cubic-bezier(.2, .8, .2, 1), opacity .3s; }
.file-room.flow .card.none { left: 736px; opacity: 0; }
.file-room.flow .card.cabinet { left: 736px; opacity: 1; }
.file-room.flow .card.teacher { left: 4px; opacity: 1; }
</style>
