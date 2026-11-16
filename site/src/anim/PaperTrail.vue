<script setup lang="ts">
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch36 story: the same student appears on three different papers. The application form the
// student fills in (Request DTO), the master page kept in the file room (PO) and the report
// handed back (Response DTO, no ID number). The section chief (Service) copies between them.
defineProps<{ terms?: boolean }>()
const { local, live } = useFixedSteps(3)
const at = (n: number) => !live.value || local.value >= n
const captions = ['同學填的申請表：只有他自己知道的事，沒有編號', '學籍簿正本：每一欄都有，留在檔案室不外流', '發給同學的成績單：有編號和等第，身分證字號不印', '三張紙各有用途；在它們之間抄寫的人是組長']
</script>

<template>
  <div class="anim-stage paper-trail">
    <div class="paper req">
      <h4><Art name="form" size="26" />申請表<em v-if="terms">Request DTO</em></h4>
      <p><span>姓名</span><b>Judy</b></p>
      <p><span>身分證字號</span><b>A223456789</b></p>
      <p><span>成績</span><b>85</b></p>
      <small>同學 → 櫃台</small>
    </div>
    <div class="arrow a1" :class="{ off: !at(1) }">→</div>
    <div class="paper po" :class="{ off: !at(1) }">
      <h4><Art name="book" size="26" />學籍簿正本<em v-if="terms">PO</em></h4>
      <p><span>編號</span><b>1</b></p>
      <p><span>姓名</span><b>Judy</b></p>
      <p class="secret"><span>身分證字號</span><b>A223456789</b></p>
      <p><span>成績</span><b>85</b></p>
      <small>只在檔案室和承辦人員之間</small>
    </div>
    <div class="arrow a2" :class="{ off: !at(2) }">→</div>
    <div class="paper res" :class="{ off: !at(2) }">
      <h4><Art name="doc" size="26" />成績單<em v-if="terms">Response DTO</em></h4>
      <p><span>編號</span><b>1</b></p>
      <p><span>姓名</span><b>Judy</b></p>
      <p><span>成績</span><b>85</b></p>
      <p><span>等第</span><b>B</b></p>
      <small>櫃台 → 同學</small>
    </div>
    <div class="chief" :class="{ off: !at(3) }">
      <Art name="teacher" size="46" /><b>組長負責在三張紙之間抄寫<em v-if="terms">Service</em></b>
    </div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.paper-trail .off { visibility: hidden; }
.slide .paper-trail h4 { display: flex; align-items: center; gap: 6px; margin: 0 0 6px; font-size: 16px; font-weight: 900; color: #2b2b2b; white-space: nowrap; }
.paper-trail em { margin-left: 4px; padding: 0 8px; border-radius: 999px; background: #2f4550; color: #fff; font: 800 12px/1.7 var(--font-mono); font-style: normal; white-space: nowrap; }
.paper-trail .paper { position: absolute; top: 4px; width: 252px; padding: 12px 14px; border: 3px solid; border-radius: 18px; }
.paper-trail .paper p { display: flex; justify-content: space-between; gap: 8px; margin: 0; padding: 2px 0; border-bottom: 1.5px dashed rgba(0,0,0,.14); font-size: 14.5px; font-weight: 800; line-height: 1.75; }
.paper-trail .paper span { color: var(--c-ink-soft); }
.paper-trail .paper b { font-family: var(--font-mono); color: #2b2b2b; }
.paper-trail .paper small { display: block; margin-top: 6px; font-size: 12.5px; font-weight: 900; }
.paper-trail .req { left: 0; border-color: #ff9600; box-shadow: 0 4px 0 #cd7900; background: #fff8ec; }
.paper-trail .req small { color: #cd7900; }
.paper-trail .po { left: 312px; border-color: #ce82ff; box-shadow: 0 4px 0 #a568cc; background: #faf2ff; }
.paper-trail .po small { color: #7d3fb0; }
.paper-trail .po .secret { background: #ffe1e1; border-radius: 6px; padding: 2px 6px; margin: 0 -6px; }
.paper-trail .po .secret b { color: #d33131; }
.paper-trail .res { right: 0; border-color: var(--c-brand); box-shadow: 0 4px 0 var(--c-brand-dark); background: #f1ffe4; }
.paper-trail .res small { color: var(--c-brand-dark); }
.paper-trail .arrow { position: absolute; top: 76px; width: 60px; text-align: center; font-size: 30px; font-weight: 900; color: #9aa7ad; }
.paper-trail .a1 { left: 252px; }
.paper-trail .a2 { left: 564px; }
.paper-trail .chief { position: absolute; left: 50%; top: 226px; transform: translateX(-50%); display: flex; align-items: center; gap: 10px; padding: 4px 20px; border: 3px solid #1cb0f6; border-radius: 18px; background: #e8f7ff; }
.paper-trail .chief b { font-size: 15.5px; font-weight: 900; color: #1378a8; white-space: nowrap; }
</style>
