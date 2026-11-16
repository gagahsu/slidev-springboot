<script setup lang="ts">
import { computed } from 'vue'
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch32 story: giving a demerit means changing two books (student register: score -10,
// demerit book: +1 record). mode="broken": the second step fails and the first one stays.
// mode="tx": both steps are one transaction, so the first one is rolled back.
const props = defineProps<{ mode?: 'broken' | 'tx' }>()
const tx = computed(() => props.mode === 'tx')
const { local, live } = useFixedSteps(3)
const at = (n: number) => !live.value || local.value >= n
const captions = computed(() => tx.value
  ? ['組長先說好：這兩件事算「同一件」', '第一件：學籍簿扣 10 分（先用鉛筆寫）', '第二件：寫記過簿的時候出錯了', '因為算同一件，第一件也擦掉：分數回到 80']
  : ['小明遲到要記過。教務處要改兩本簿子', '第一件：學籍簿扣 10 分，成功', '第二件：寫記過簿的時候出錯了', '結果：分數被扣了，記過簿卻沒有紀錄。兩本簿子對不起來'])
const rolled = computed(() => tx.value && at(3))
</script>

<template>
  <div class="anim-stage two-books" :class="{ tx }">
    <i v-if="tx" class="frame"><em>同一筆交易</em></i>
    <div class="book b1" :class="{ hot: live && local === 1, bad: !tx && at(3), back: rolled }">
      <h4><Art name="book" size="28" />學籍簿</h4>
      <p>小明的分數</p>
      <b><s v-if="at(1) && !rolled">80</s><span>{{ at(1) && !rolled ? 70 : 80 }}</span></b>
      <small :class="{ off: !at(1) }">{{ rolled ? '已復原' : tx ? '扣 10 分（鉛筆）' : '扣 10 分 ✓' }}</small>
    </div>
    <div class="book b2" :class="{ hot: live && local === 2, bad: at(2) }">
      <h4><Art name="book" size="28" />記過簿</h4>
      <p>小明的記過紀錄</p>
      <b><span>0 筆</span></b>
      <small :class="{ off: !at(2) }">寫入失敗 ✗</small>
    </div>
    <div class="who"><Art :name="tx ? 'teacher' : 'staff'" size="64" /><span>{{ tx ? '組長' : '承辦人員' }}</span></div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.two-books .off { visibility: hidden; }
.two-books .frame { position: absolute; left: 150px; top: 0; width: 600px; height: 262px; border: 3px dashed var(--c-brand); border-radius: 26px; background: #f7fff0; }
.two-books .frame em { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); padding: 2px 16px; border-radius: 999px; background: var(--c-brand); color: #fff; font-size: 14px; font-style: normal; font-weight: 900; white-space: nowrap; }
.two-books .book { position: absolute; top: 30px; display: flex; flex-direction: column; align-items: center; width: 240px; height: 210px; padding-top: 14px; border: 3px solid var(--c-line); border-radius: 20px; box-shadow: 0 4px 0 var(--c-line); background: #fff; transition: border-color .3s, box-shadow .3s, background-color .3s; }
.two-books .b1 { left: 180px; } .two-books .b2 { left: 480px; }
.slide .two-books h4 { display: flex; align-items: center; gap: 6px; margin: 0; font-size: 17px; font-weight: 900; color: #2b2b2b; }
.two-books .book p { margin: 8px 0 0; color: var(--c-ink-soft); font-size: 14px; font-weight: 800; }
.two-books .book b { display: flex; align-items: baseline; gap: 10px; margin-top: 4px; font-size: 40px; font-weight: 900; color: #2b2b2b; }
.two-books .book s { font-size: 22px; color: var(--c-ink-soft); }
.two-books .book small { margin-top: 4px; font-size: 14.5px; font-weight: 900; color: var(--c-blue-dark); }
.two-books .book.hot { border-color: var(--c-blue); box-shadow: 0 4px 0 var(--c-blue-dark); background: #f2fbff; }
.two-books .book.bad { border-color: #ff4b4b; box-shadow: 0 4px 0 #d33131; background: #fff1f1; }
.two-books .book.bad small { color: #d33131; }
.two-books .book.back { border-color: var(--c-brand); box-shadow: 0 4px 0 var(--c-brand-dark); background: #f1ffe4; }
.two-books .book.back small { color: var(--c-brand-dark); }
.two-books .who { position: absolute; left: 20px; top: 84px; display: flex; flex-direction: column; align-items: center; width: 110px; font-size: 15px; font-weight: 900; }
</style>
