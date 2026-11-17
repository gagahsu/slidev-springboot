<script setup lang="ts">
import { useFixedSteps } from '../lib/steps'

// ch38 story: a stack of student cards goes onto a conveyor belt with three stations:
// pick (filter), rewrite (map), gather (toList).
defineProps<{ terms?: boolean }>()
const { local, live } = useFixedSteps(3)
const at = (n: number) => !live.value || local.value >= n
const captions = ['把一疊資料卡放上輸送帶', '第一站「挑」：只留下及格的，Amy 的卡片被拿走', '第二站「改」：每一張卡片，只抄下名字', '第三站「收」：把輸送帶上剩下的東西，收成一份新的清單']
const cards = [{ name: 'Tom', score: 85, ok: true }, { name: 'Amy', score: 52, ok: false }, { name: 'Bob', score: 70, ok: true }]
</script>

<template>
  <div class="anim-stage conveyor">
    <div class="st s0"><h4>一疊資料卡<em v-if="terms">students.stream()</em></h4></div>
    <div class="st s1" :class="{ on: at(1) }"><h4>① 挑<em v-if="terms">.filter(s -> s.getScore() >= 60)</em></h4><small>只留下及格的</small></div>
    <div class="st s2" :class="{ on: at(2) }"><h4>② 改<em v-if="terms">.map(s -> s.getName())</em></h4><small>只抄下名字</small></div>
    <div class="st s3" :class="{ on: at(3) }"><h4>③ 收<em v-if="terms">.toList()</em></h4><small>收成新的清單</small></div>
    <div class="belt">
      <div v-for="c in cards" :key="c.name" class="card" :class="{ gone: at(1) && !c.ok, small: at(2), done: at(3) }">
        <b>{{ c.name }}</b><span v-if="!at(2)">{{ c.score }} 分</span>
      </div>
    </div>
    <p class="out" :class="{ off: !at(3) }">新的清單：<b>[Tom, Bob]</b><em v-if="terms">List&lt;String&gt;</em></p>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.conveyor em { font-variant-ligatures: none; margin-left: 6px; padding: 0 8px; border-radius: 999px; background: #2f4550; color: #fff; font: 800 12px/1.7 var(--font-mono); font-style: normal; white-space: nowrap; }
.conveyor .off { visibility: hidden; }
.conveyor .st { position: absolute; top: 0; height: 74px; padding: 8px 10px; border: 3px solid #dfe6ea; border-radius: 16px; background: #fff; transition: all .3s; }
.conveyor .st.on { border-color: #ffc800; background: #fff9db; box-shadow: 0 4px 0 #cd9f00; }
.conveyor .s0 { left: 0; width: 200px; border-color: #1cb0f6; background: #e8f7ff; box-shadow: 0 4px 0 #1378a8; }
.conveyor .s1 { left: 212px; width: 250px; }
.conveyor .s2 { left: 474px; width: 220px; }
.conveyor .s3 { left: 706px; width: 170px; }
.slide .conveyor h4 { margin: 0; font-size: 15.5px; font-weight: 900; color: #2b2b2b; white-space: nowrap; line-height: 1.5; }
.conveyor .st h4 em { display: block; width: fit-content; margin: 2px 0 0; font-size: 11px; }
.conveyor .st small { font-size: 13px; font-weight: 800; color: #5d6b74; }
.conveyor.anim-stage .st h4 em + small, .conveyor .st h4:has(em) + small { display: none; }
.conveyor .belt { position: absolute; left: 0; right: 0; top: 112px; height: 86px; display: flex; align-items: center; justify-content: center; gap: 26px; border-top: 6px solid #8b9aa3; border-bottom: 6px solid #8b9aa3; background: repeating-linear-gradient(90deg, #eef1f3 0 24px, #e2e7ea 24px 48px); border-radius: 10px; }
.conveyor .card { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 110px; height: 60px; border: 3px solid #1cb0f6; border-radius: 12px; background: #fff; box-shadow: 0 3px 0 #1378a8; transition: all .35s; }
.conveyor .card b { font-size: 16px; font-weight: 900; color: #2b2b2b; }
.conveyor .card span { font-size: 13.5px; font-weight: 800; color: #1378a8; }
.conveyor .card.gone { opacity: .22; transform: translateY(-14px); border-color: #ff4b4b; box-shadow: none; }
.conveyor .card.small { height: 42px; border-color: #ce82ff; box-shadow: 0 3px 0 #a568cc; }
.conveyor .card.done:not(.gone) { border-color: var(--c-brand); box-shadow: 0 3px 0 var(--c-brand-dark); background: #f1ffe4; }
.conveyor .out { position: absolute; left: 0; right: 0; top: 214px; margin: 0; text-align: center; font-size: 16px; font-weight: 900; color: #2b2b2b; }
.conveyor .out b { padding: 2px 12px; border-radius: 999px; border: 2px solid var(--c-brand); background: #f1ffe4; color: var(--c-brand-dark); font-family: var(--font-mono); }
</style>
