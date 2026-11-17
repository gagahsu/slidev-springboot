<script setup lang="ts">
import { useFixedSteps } from '../lib/steps'

// ch29 story: a report card is a folder, each subject score is a sheet that carries the number of
// the report card it belongs to (foreign key). mode="many": report cards and awards are linked
// through a third table that only holds pairs of numbers.
const props = defineProps<{ mode?: 'one' | 'many', terms?: boolean }>()
const many = props.mode === 'many'
const { local, live } = useFixedSteps(3)
const at = (n: number) => !live.value || local.value >= n
const captions = many
  ? ['一張成績單可以有很多個獎項，一個獎項也可以蓋在很多張成績單上', '編號寫在哪一邊都不對：一格只能寫一個編號', '所以多準備一張「對照表」，每一列記一組「成績單編號＋獎項編號」', 'Tom 的成績單（1 號）有兩個獎：看對照表裡 1 號的那兩列']
  : ['教務處有兩本簿子：成績單，和每一科的成績', '每一筆科目成績，都多一格「成績單編號」，寫著它屬於哪一張成績單', '從成績單這邊看：1 號成績單，有很多筆科目成績', '從科目成績這邊看：每一筆，只屬於一張成績單']
</script>

<template>
  <div class="anim-stage link-tables" :class="{ many }">
    <div class="tb left">
      <h4>成績單<em v-if="terms">ReportCard</em></h4>
      <div class="hd"><span>編號</span><span>學生</span></div>
      <div class="r" :class="{ hit: at(many ? 3 : 2) }"><span>1</span><span>Tom</span></div>
      <div class="r"><span>2</span><span>Amy</span></div>
      <p v-if="!many" class="side" :class="{ off: !at(2) }">一張 → 多筆<em v-if="terms">@OneToMany</em></p>
    </div>
    <div v-if="many" class="tb mid" :class="{ off: !at(2) }">
      <h4>對照表<em v-if="terms">@JoinTable</em></h4>
      <div class="hd"><span>成績單編號</span><span>獎項編號</span></div>
      <div class="r" :class="{ hit: at(3) }"><span>1</span><span>1</span></div>
      <div class="r" :class="{ hit: at(3) }"><span>1</span><span>2</span></div>
      <div class="r"><span>2</span><span>1</span></div>
      <p class="side">多 ↔ 多<em v-if="terms">@ManyToMany</em></p>
    </div>
    <div class="tb right">
      <h4>{{ many ? '獎項' : '科目成績' }}<em v-if="terms">{{ many ? 'Award' : 'SubjectScore' }}</em></h4>
      <template v-if="many">
        <div class="hd"><span>編號</span><span>名稱</span></div>
        <div class="r" :class="{ hit: at(3) }"><span>1</span><span>全勤獎</span></div>
        <div class="r" :class="{ hit: at(3) }"><span>2</span><span>進步獎</span></div>
        <p class="warn" :class="{ off: !(live && local === 1) }">成績單編號要寫幾號？1 號和 2 號都有全勤獎…</p>
      </template>
      <template v-else>
        <div class="hd c4"><span>編號</span><span>科目</span><span>分數</span><span class="fk" :class="{ off: !at(1) }">成績單編號<em v-if="terms">外鍵</em></span></div>
        <div class="r c4" :class="{ hit: at(2) }"><span>1</span><span>國文</span><span>85</span><span class="fk" :class="{ off: !at(1) }">1</span></div>
        <div class="r c4" :class="{ hit: at(2) }"><span>2</span><span>數學</span><span>92</span><span class="fk" :class="{ off: !at(1) }">1</span></div>
        <div class="r c4"><span>3</span><span>國文</span><span>70</span><span class="fk" :class="{ off: !at(1) }">2</span></div>
        <p class="side" :class="{ off: !at(3) }">每一筆 → 一張<em v-if="terms">@ManyToOne</em></p>
      </template>
    </div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.link-tables em { margin-left: 6px; padding: 0 8px; border-radius: 999px; background: #2f4550; color: #fff; font: 800 12px/1.7 var(--font-mono); font-style: normal; white-space: nowrap; }
.link-tables .off { visibility: hidden; }
.link-tables .tb { position: absolute; top: 4px; padding: 10px 12px 12px; border: 3px solid #ce82ff; border-radius: 18px; background: #faf2ff; box-shadow: 0 4px 0 #a568cc; }
.link-tables .left { left: 0; width: 250px; }
.link-tables .right { right: 0; width: 520px; border-color: #1cb0f6; background: #e8f7ff; box-shadow: 0 4px 0 #1378a8; }
.link-tables.many .left { width: 230px; }
.link-tables.many .right { width: 250px; }
.link-tables .mid { left: 262px; width: 320px; border-color: #ffc800; background: #fff9db; box-shadow: 0 4px 0 #cd9f00; }
.slide .link-tables h4 { margin: 0 0 6px; font-size: 16px; font-weight: 900; color: #2b2b2b; white-space: nowrap; }
.link-tables .hd, .link-tables .r { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 2px 10px; font-size: 14.5px; font-weight: 800; white-space: nowrap; }
.link-tables .c4 { grid-template-columns: 50px 70px 60px 1fr; }
.link-tables .hd { color: #5d6b74; font-size: 13px; }
.link-tables .r { margin-top: 5px; border: 2px solid #dfe6ea; border-radius: 10px; background: #fff; color: #2b2b2b; transition: border-color .3s, background-color .3s; }
.link-tables .r.hit { border-color: var(--c-brand); background: #f1ffe4; }
.link-tables .fk { color: #cd7900; font-weight: 900; }
.link-tables .side { margin: 10px 0 0; font-size: 14.5px; font-weight: 900; color: #2b2b2b; white-space: nowrap; }
.link-tables .warn { margin: 10px 0 0; font-size: 13.5px; font-weight: 900; color: #c62828; line-height: 1.5; }
</style>
