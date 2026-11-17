<script setup lang="ts">
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch45 story: instead of a number tag that points to a locker, the office issues a pass that
// carries the facts itself and is embossed with the school seal (JWT + signature). Any desk can
// check the seal without a locker; a tampered pass no longer matches its seal.
defineProps<{ terms?: boolean }>()
const { local, live } = useFixedSteps(3)
const at = (n: number) => !live.value || local.value >= n
const captions = ['Tom 到 A 櫃台，報上帳號和密碼', 'A 櫃台發一張通行證：資料寫在證上，再蓋上學校的鋼印', 'Tom 拿著它到 B 櫃台。B 只要檢查鋼印，不用查任何置物櫃', '如果有人把「學生」塗改成「老師」，鋼印就對不上了']
</script>

<template>
  <div class="anim-stage pass-card">
    <div class="who">
      <Art name="you" size="78" />
      <b>Tom<em v-if="terms">瀏覽器</em></b>
    </div>
    <div class="pass" :class="{ off: !at(1), bad: at(3) && live && local === 3 }">
      <h4><Art name="card" size="24" />通行證<em v-if="terms">JWT</em></h4>
      <div class="row"><span>姓名</span><i>Tom</i><em v-if="terms">sub</em></div>
      <div class="row role"><span>身分</span><i v-if="live && local === 3" class="fake">老師（塗改）</i><i v-else>學生</i><em v-if="terms">role</em></div>
      <div class="row"><span>期限</span><i>今天 17:00</i><em v-if="terms">exp</em></div>
      <div class="seal"><b>{{ live && local === 3 ? '鋼印不符' : '學校鋼印' }}</b><em v-if="terms">Signature</em></div>
    </div>
    <div class="desks">
      <div class="desk">
        <Art name="clerk" size="46" />
        <div><b>A 櫃台<em v-if="terms">POST /auth/login</em></b><small :class="{ off: !at(1) }">核對帳號密碼 → 發證</small></div>
      </div>
      <div class="desk" :class="{ off: !at(2), nope: live && local === 3 }">
        <Art name="clerk" size="46" />
        <div><b>B 櫃台<em v-if="terms">任何一台伺服器</em></b><small v-if="live && local === 3">鋼印不符，拒絕<em v-if="terms">401</em></small><small v-else>鋼印正確，放行（不用置物櫃）</small></div>
      </div>
    </div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.pass-card em { margin-left: 6px; padding: 0 8px; border-radius: 999px; background: #2f4550; color: #fff; font: 800 12px/1.7 var(--font-mono); font-style: normal; white-space: nowrap; }
.pass-card .off { visibility: hidden; }
.pass-card i { font-style: normal; }
.pass-card .who { position: absolute; left: 0; top: 40px; width: 150px; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.pass-card .who > b { font-size: 16px; font-weight: 900; color: #2b2b2b; white-space: nowrap; }
.pass-card .pass { position: absolute; left: 170px; top: 6px; width: 300px; padding: 12px 16px; border: 3px solid #1cb0f6; border-radius: 18px; background: #fff; box-shadow: 0 4px 0 #1378a8; transition: border-color .3s, box-shadow .3s; }
.pass-card .pass.bad { border-color: #ff4b4b; box-shadow: 0 4px 0 #c62828; }
.slide .pass-card h4 { display: flex; align-items: center; gap: 6px; margin: 0 0 6px; font-size: 16px; font-weight: 900; color: #2b2b2b; }
.pass-card .row { display: flex; align-items: center; gap: 8px; margin-top: 5px; padding: 3px 10px; border-radius: 10px; background: #e8f7ff; font-size: 14.5px; font-weight: 900; color: #2b2b2b; white-space: nowrap; }
.pass-card .row span { color: #1378a8; }
.pass-card .row .fake { color: #c62828; }
.pass-card .seal { display: flex; align-items: center; justify-content: center; gap: 4px; margin-top: 9px; padding: 4px 10px; border: 3px dashed #ff9600; border-radius: 999px; background: #fff8ec; }
.pass-card .seal b { font-size: 14.5px; font-weight: 900; color: #cd7900; }
.pass-card .bad .seal { border-color: #ff4b4b; background: #fff0f0; }
.pass-card .bad .seal b { color: #c62828; }
.pass-card .desks { position: absolute; right: 0; top: 14px; width: 380px; display: flex; flex-direction: column; gap: 16px; }
.pass-card .desk { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 3px solid var(--c-brand); border-radius: 16px; background: #f1ffe4; box-shadow: 0 4px 0 var(--c-brand-dark); }
.pass-card .desk.nope { border-color: #ff4b4b; background: #fff0f0; box-shadow: 0 4px 0 #c62828; }
.pass-card .desk b { display: block; font-size: 15.5px; font-weight: 900; color: #2b2b2b; white-space: nowrap; }
.pass-card .desk small { display: block; margin-top: 2px; font-size: 13.5px; font-weight: 800; color: #5d6b74; white-space: nowrap; }
</style>
