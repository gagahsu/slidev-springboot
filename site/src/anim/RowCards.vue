<script setup lang="ts">
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch25 story: what comes back from the file room is a table, row by row. Someone has to copy
// every row onto a student card (RowMapper.mapRow is called once per row); the stack of cards
// is the List<Student>. `terms` adds the programming names.
defineProps<{ terms?: boolean }>()
const rows = [{ id: 1, name: 'Judy' }, { id: 2, name: 'Tom' }, { id: 3, name: 'Amy' }]
const { local, live } = useFixedSteps(4)
const at = (n: number) => !live.value || local.value >= n
const captions = ['檔案室交回來的，是一張一列一列的表格', '照著抄寫規則，把第 1 列抄成一張學生資料卡', '第 2 列，再抄一張', '第 3 列，再抄一張：有幾列就抄幾次', '最後把資料卡疊成一疊，交回去']
</script>

<template>
  <div class="anim-stage row-cards">
    <div class="table">
      <h4><Art name="cabinet" size="26" />調閱回來的表格<em v-if="terms">ResultSet</em></h4>
      <p class="head"><span>id</span><span>name</span></p>
      <p v-for="(r, n) in rows" :key="r.id" :class="{ hot: live && local === n + 1, done: at(n + 1) }"><span>{{ r.id }}</span><span>{{ r.name }}</span></p>
    </div>
    <div class="rule" :class="{ off: !at(1) }">
      <Art name="staff" size="58" />
      <b>抄寫規則<em v-if="terms">RowMapper</em></b>
      <small>id 欄 → 卡片的 id<br>name 欄 → 卡片的 name</small>
    </div>
    <div class="cards" :class="{ stacked: at(4) }">
      <h4 :class="{ off: !at(4) }">一疊資料卡<em v-if="terms">List&lt;Student&gt;</em></h4>
      <div v-for="(r, n) in rows" :key="r.id" class="card" :class="{ off: !at(n + 1) }" :style="{ '--n': n }">
        <Art name="card" size="40" /><span>id：{{ r.id }}<br>name：{{ r.name }}</span>
      </div>
      <i v-if="terms" class="one" :class="{ off: !at(1) || at(4) }">一張卡 = 一個 Student 物件</i>
    </div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.row-cards .off { visibility: hidden; }
.slide .row-cards h4 { display: flex; align-items: center; gap: 6px; margin: 0 0 8px; font-size: 16px; font-weight: 900; color: #2b2b2b; white-space: nowrap; }
.row-cards em { margin-left: 6px; padding: 0 9px; border-radius: 999px; background: #2f4550; color: #fff; font: 800 12.5px/1.7 var(--font-mono); font-style: normal; white-space: nowrap; }
.row-cards .table { position: absolute; left: 0; top: 8px; width: 270px; padding: 14px 16px; border: 3px solid #8b9aa3; border-radius: 18px; box-shadow: 0 4px 0 #5d6b74; background: #f6f8f9; }
.row-cards .table p { display: grid; grid-template-columns: 70px 1fr; margin: 0; border-bottom: 2px solid #dfe6ea; font: 700 17px/2.1 var(--font-mono); transition: background-color .3s, opacity .3s; }
.row-cards .table p span { padding-left: 10px; }
.row-cards .table .head { color: var(--c-ink-soft); font-size: 14px; }
.row-cards .table p.hot { background: #fff3c4; }
.row-cards .table p.done:not(.hot) { opacity: .5; }
.row-cards .rule { position: absolute; left: 306px; top: 40px; display: flex; flex-direction: column; align-items: center; gap: 4px; width: 210px; padding: 10px 0 12px; border: 3px dashed #ce82ff; border-radius: 18px; background: #faf2ff; }
.row-cards .rule b { font-size: 15.5px; font-weight: 900; color: #7d3fb0; }
.row-cards .rule small { color: #2b2b2b; font-size: 13.5px; font-weight: 800; line-height: 1.6; text-align: center; }
.row-cards .cards { position: absolute; left: 556px; top: 8px; width: 320px; height: 270px; }
.row-cards .card { position: absolute; left: 0; top: calc(34px + var(--n) * 76px); display: flex; align-items: center; gap: 8px; width: 230px; padding: 6px 14px 6px 8px; border: 3px solid var(--c-blue); border-radius: 14px; box-shadow: 0 4px 0 var(--c-blue-dark); background: #f2fbff; font: 700 15px/1.45 var(--font-mono); transition: top .6s cubic-bezier(.2, .8, .2, 1), left .6s cubic-bezier(.2, .8, .2, 1); }
.row-cards .stacked .card { top: calc(60px + var(--n) * 16px); left: calc(20px + var(--n) * 16px); }
.row-cards .one { position: absolute; left: 0; bottom: -2px; color: var(--c-blue-dark); font-size: 14px; font-style: normal; font-weight: 900; white-space: nowrap; }
</style>
