<script setup lang="ts">
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch44 story: the guard at the school gate. First he checks who you are (authentication), then
// looks up what you are allowed to do (authorization): a student may ask for grades at the front
// desk but may not enter the grade room.
defineProps<{ terms?: boolean }>()
const { local, live } = useFixedSteps(3)
const at = (n: number) => !live.value || local.value >= n
const captions = ['Tom 來到校門口，想進學校辦事', '第一關：警衛看學生證，確認「你是誰」', '第二關：警衛查名冊，看這個身分「可以做什麼」', '學生可以到櫃台查成績，但是不能進成績室改成績']
</script>

<template>
  <div class="anim-stage gate-guard">
    <div class="who">
      <Art name="you" size="78" />
      <b>Tom<em v-if="terms">使用者</em></b>
      <div class="tag"><Art name="card" size="22" /><span>學生證</span></div>
      <em v-if="terms" class="under">帳號＋密碼</em>
    </div>
    <div class="guard">
      <Art name="guard" size="84" />
      <b>警衛<em v-if="terms">Spring Security</em></b>
      <p class="chk c1" :class="{ off: !at(1) }"><span>①</span>你是誰？<i>Tom ✓</i><em v-if="terms">認證 Authentication</em></p>
      <p class="chk c2" :class="{ off: !at(2) }"><span>②</span>你能做什麼？<i>身分：學生</i><em v-if="terms">授權 Authorization</em></p>
    </div>
    <div class="rooms" :class="{ off: !at(3) }">
      <div class="room yes"><Art name="ok" size="30" /><div><b>櫃台：查成績</b><small>學生可以</small><em v-if="terms">GET /students → 200</em></div></div>
      <div class="room nope"><Art name="no" size="30" /><div><b>成績室：改成績</b><small>只有老師可以</small><em v-if="terms">PUT /students/1 → 403</em></div></div>
    </div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.gate-guard em { margin-left: 6px; padding: 0 8px; border-radius: 999px; background: #2f4550; color: #fff; font: 800 12px/1.7 var(--font-mono); font-style: normal; white-space: nowrap; }
.gate-guard .off { visibility: hidden; }
.gate-guard i { font-style: normal; }
.gate-guard .who, .gate-guard .guard { position: absolute; top: 14px; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.gate-guard .who { left: 0; width: 170px; }
.gate-guard .guard { left: 190px; width: 380px; }
.gate-guard .who > b, .gate-guard .guard > b { font-size: 16px; font-weight: 900; color: #2b2b2b; white-space: nowrap; }
.gate-guard .tag { margin-top: 10px; display: flex; align-items: center; gap: 6px; padding: 4px 12px; border: 3px solid #1cb0f6; border-radius: 12px; background: #e8f7ff; box-shadow: 0 3px 0 #1378a8; white-space: nowrap; font-size: 15px; font-weight: 900; color: #1378a8; }
.gate-guard .under { margin: 6px 0 0; }
.gate-guard .chk { display: flex; align-items: center; gap: 6px; margin: 8px 0 0; padding: 4px 14px; border: 3px solid #ffc800; border-radius: 14px; background: #fff9db; color: #2b2b2b; font-size: 15px; font-weight: 900; white-space: nowrap; }
.gate-guard .chk span { color: #cd7900; font-size: 17px; }
.gate-guard .chk i { padding: 0 8px; border-radius: 999px; background: #fff; border: 2px solid var(--c-brand); color: var(--c-brand-dark); font-size: 13.5px; }
.gate-guard .rooms { position: absolute; right: 0; top: 24px; width: 280px; display: flex; flex-direction: column; gap: 14px; }
.gate-guard .room { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 3px solid var(--c-brand); border-radius: 16px; background: #f1ffe4; box-shadow: 0 4px 0 var(--c-brand-dark); }
.gate-guard .room.nope { border-color: #ff4b4b; background: #fff0f0; box-shadow: 0 4px 0 #c62828; }
.gate-guard .room b { display: block; font-size: 15.5px; font-weight: 900; color: #2b2b2b; white-space: nowrap; }
.gate-guard .room small { display: block; font-size: 13px; font-weight: 800; color: #5d6b74; }
.gate-guard .room em { display: inline-block; margin: 3px 0 0; }
</style>
