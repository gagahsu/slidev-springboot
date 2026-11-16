<script setup lang="ts">
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch24 story: a request slip (SQL) with the values written in can only ever create the same
// student. Leave named blanks (:studentId, :studentName) instead, bring a separate fill-in sheet
// (Map), and the clerk (update()) fills the blanks and files the slip.
defineProps<{ terms?: boolean }>()
const { local, live } = useFixedSteps(3)
const at = (n: number) => !live.value || local.value >= n
const captions = ['把值直接寫死在申請單上：這張單永遠只能建「1 號 Judy」', '改成留空格，而且每個空格都取一個名字', '另外準備一張對照表：哪個空格要填什麼', '承辦人員照著對照表把空格填好，再送進檔案室']
</script>

<template>
  <div class="anim-stage sql-slip">
    <div class="slip">
      <h4><Art name="form" size="26" />申請單<em v-if="terms">SQL</em></h4>
      <pre>INSERT INTO student(id, name)
VALUES (<span class="hole" :class="{ named: at(1), filled: at(3) }"><b v-if="!at(1) || at(3)">1</b><i v-if="at(1) && !at(3)">:studentId</i></span>, <span class="hole" :class="{ named: at(1), filled: at(3) }"><b v-if="!at(1) || at(3)">'Judy'</b><i v-if="at(1) && !at(3)">:studentName</i></span>)</pre>
      <p class="tag" :class="{ off: !at(1) }">有名字的空格<em v-if="terms">具名參數</em></p>
    </div>
    <div class="sheet" :class="{ off: !at(2) }">
      <h4><Art name="doc" size="26" />填空對照表<em v-if="terms">Map</em></h4>
      <p><span>studentId</span><i>→</i><b>1</b></p>
      <p><span>studentName</span><i>→</i><b>"Judy"</b></p>
      <small>名字要和空格一模一樣</small>
    </div>
    <div class="go" :class="{ off: !at(3) }">
      <Art name="staff" size="64" />
      <b>承辦人員填好、送件<em v-if="terms">update(sql, map)</em></b>
      <Art name="cabinet" size="64" />
    </div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.sql-slip .off { visibility: hidden; }
.sql-slip i { font-style: normal; }
.slide .sql-slip h4 { display: flex; align-items: center; gap: 6px; margin: 0 0 8px; font-size: 16px; font-weight: 900; color: #2b2b2b; }
.sql-slip em { margin-left: 6px; padding: 0 9px; border-radius: 999px; background: #2f4550; color: #fff; font: 800 12.5px/1.7 var(--font-mono); font-style: normal; white-space: nowrap; }
.sql-slip .slip { position: absolute; left: 0; top: 8px; width: 520px; padding: 14px 18px; border: 3px solid #ff9600; border-radius: 18px; box-shadow: 0 4px 0 #cd7900; background: #fff8ec; }
.slide .sql-slip .slip pre { margin: 0; padding: 0; border: 0; background: none; box-shadow: none; color: #2b2b2b; font: 700 17px/2.3 var(--font-mono); white-space: pre; }
.sql-slip .hole { position: relative; display: inline-block; padding: 0 6px; border-radius: 8px; line-height: 1.6; transition: background-color .3s; }
.sql-slip .hole b { color: var(--c-brand-dark); }
.sql-slip .hole.named { border: 2px dashed #ce82ff; background: #fff; }
.sql-slip .hole.named i { color: #7d3fb0; }
.sql-slip .hole.named.filled { border-style: solid; border-color: var(--c-brand); background: #f1ffe4; }
.sql-slip .tag { margin: 6px 0 0; color: #7d3fb0; font-size: 14px; font-weight: 900; }
.sql-slip .sheet { position: absolute; right: 0; top: 8px; width: 310px; padding: 14px 18px; border: 3px solid #ce82ff; border-radius: 18px; box-shadow: 0 4px 0 #a568cc; background: #faf2ff; }
.sql-slip .sheet p { display: flex; align-items: center; gap: 10px; margin: 0; font: 700 16.5px/2 var(--font-mono); }
.sql-slip .sheet span { color: #7d3fb0; }
.sql-slip .sheet b { color: var(--c-brand-dark); }
.sql-slip .sheet small { display: block; margin-top: 4px; color: var(--c-ink-soft); font-size: 13px; font-weight: 800; }
.sql-slip .go { position: absolute; left: 50%; top: 202px; transform: translateX(-50%); display: flex; align-items: center; gap: 14px; padding: 8px 22px; border: 3px solid var(--c-brand); border-radius: 20px; background: #f1ffe4; }
.sql-slip .go b { font-size: 16px; font-weight: 900; color: var(--c-brand-dark); white-space: nowrap; }
</style>
