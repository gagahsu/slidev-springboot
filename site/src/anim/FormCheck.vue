<script setup lang="ts">
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch39 story: a badly filled application form. The rules are printed next to each box
// (constraint annotations), the front desk checks it on the spot (@Valid) and hands back a
// rejection note listing every problem (400 + error list) before anything reaches the file room.
defineProps<{ terms?: boolean }>()
const { local, live } = useFixedSteps(3)
const at = (n: number) => !live.value || local.value >= n
const captions = ['一張亂填的申請表：姓名沒寫、成績 200、身分證字號少了好幾碼', '規則直接印在每一格的旁邊', '櫃台收件時當場檢查，不合規則的格子打叉', '退件，並且一次告訴你哪幾格有問題。資料沒有進檔案室']
</script>

<template>
  <div class="anim-stage form-check">
    <div class="form">
      <h4><Art name="form" size="26" />新生申請表</h4>
      <div class="row" :class="{ bad: at(2) }"><span>姓名</span><b class="blank">（沒填）</b><i :class="{ off: !at(1) }">{{ terms ? '@NotBlank' : '一定要填' }}</i><u :class="{ off: !at(2) }">✗</u></div>
      <div class="row" :class="{ bad: at(2) }"><span>成績</span><b>200</b><i :class="{ off: !at(1) }">{{ terms ? '@Min(0) @Max(100)' : '0 到 100' }}</i><u :class="{ off: !at(2) }">✗</u></div>
      <div class="row" :class="{ bad: at(2) }"><span>身分證字號</span><b>A12</b><i :class="{ off: !at(1) }">{{ terms ? '@ValidIdNumber' : '1 個字母 + 9 個數字' }}</i><u :class="{ off: !at(2) }">✗</u></div>
    </div>
    <div class="desk" :class="{ off: !at(2) }">
      <Art name="clerk" size="62" />
      <b>櫃台當場檢查<em v-if="terms">@Valid</em></b>
    </div>
    <div class="note" :class="{ off: !at(3) }">
      <h4><Art name="no" size="24" />退件單<em v-if="terms">400 Bad Request</em></h4>
      <p>姓名：不能空白</p>
      <p>成績：不能超過 100</p>
      <p>身分證字號：格式不正確</p>
    </div>
    <div class="room" :class="{ off: !at(3) }"><Art name="cabinet" size="50" /><b>檔案室沒有收到任何東西</b></div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.form-check .off { visibility: hidden; }
.form-check i { font-style: normal; }
.form-check u { text-decoration: none; }
.slide .form-check h4 { display: flex; align-items: center; gap: 6px; margin: 0 0 8px; font-size: 16px; font-weight: 900; color: #2b2b2b; white-space: nowrap; }
.form-check em { margin-left: 6px; padding: 0 9px; border-radius: 999px; background: #2f4550; color: #fff; font: 800 12.5px/1.7 var(--font-mono); font-style: normal; white-space: nowrap; }
.form-check .form { position: absolute; left: 0; top: 4px; width: 500px; padding: 14px 18px; border: 3px solid #ff9600; border-radius: 18px; box-shadow: 0 4px 0 #cd7900; background: #fff8ec; }
.form-check .row { display: grid; grid-template-columns: 96px 78px 1fr 26px; align-items: center; gap: 8px; margin-top: 8px; padding: 6px 10px; border: 2px solid #ecd9b8; border-radius: 12px; background: #fff; font-size: 15px; font-weight: 800; transition: border-color .3s, background-color .3s; }
.form-check .row span { color: var(--c-ink-soft); }
.form-check .row b { font-family: var(--font-mono); color: #2b2b2b; }
.form-check .row b.blank { font-family: inherit; color: #b9b9b9; font-size: 13.5px; }
.form-check .row i { justify-self: start; padding: 0 9px; border-radius: 999px; background: #efe3ff; color: #7d3fb0; font: 800 13px/1.9 var(--font-mono); white-space: nowrap; }
.form-check .row u { color: #d33131; font-size: 20px; font-weight: 900; }
.form-check .row.bad { border-color: #ff7878; background: #fff1f1; }
.form-check .desk { position: absolute; left: 508px; top: 54px; width: 110px; display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center; }
.form-check .desk b { font-size: 14px; font-weight: 900; color: #1378a8; }
.form-check .desk em { display: inline-block; margin: 4px 0 0; }
.form-check .note { position: absolute; right: 0; top: 4px; width: 250px; padding: 12px 14px; border: 3px solid #ff4b4b; border-radius: 18px; box-shadow: 0 4px 0 #c93a3a; background: #fff1f1; }
.form-check .note p { margin: 0; font-size: 14px; font-weight: 800; line-height: 1.9; color: #a52a2a; }
.form-check .room { position: absolute; right: 0; top: 196px; width: 232px; display: flex; align-items: center; gap: 8px; }
.form-check .room b { font-size: 13.5px; font-weight: 900; color: var(--c-ink-soft); }
</style>
