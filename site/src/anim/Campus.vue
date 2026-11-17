<script setup lang="ts">
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch46 story: the school grew, so the office was split into separate offices. Each office
// registers in the directory (Eureka), visitors only talk to the service desk at the gate
// (Gateway), and offices phone each other on the internal line (OpenFeign).
defineProps<{ terms?: boolean }>()
const { local, live } = useFixedSteps(3)
const at = (n: number) => !live.value || local.value >= n
const captions = ['學校變大了，教務處拆成兩個獨立的處室，各自有各自的檔案室', '每個處室開門的時候，先到通訊錄登記「我在哪一間」', '同學只找大門的服務台。服務台查通訊錄，把人帶到對的處室', '處室之間需要對方的資料時，查通訊錄，打內線電話去問']
</script>

<template>
  <div class="anim-stage campus">
    <div class="dir" :class="{ off: !at(1) }">
      <h4><Art name="book" size="24" />處室通訊錄<em v-if="terms">Eureka Server :8761</em></h4>
      <div class="line"><span>{{ terms ? 'student-service' : '學籍組' }}</span><i>{{ terms ? 'localhost:8081' : '201 室' }}</i></div>
      <div class="line"><span>{{ terms ? 'club-service' : '社團組' }}</span><i>{{ terms ? 'localhost:8082' : '305 室' }}</i></div>
    </div>
    <div class="who" :class="{ off: !at(2) }">
      <Art name="you" size="62" />
      <b>Tom</b>
    </div>
    <div class="gate" :class="{ off: !at(2) }">
      <Art name="clerk" size="50" />
      <b>大門服務台</b>
      <em v-if="terms">Gateway :8080</em>
      <small>{{ terms ? '/clubs/** → club-service' : '「社團的事？請到 305 室」' }}</small>
    </div>
    <div class="office o1">
      <Art name="cabinet" size="40" />
      <div><b>學籍組</b><small>學生資料</small><em v-if="terms">student-service</em></div>
    </div>
    <div class="office o2">
      <Art name="cabinet" size="40" />
      <div><b>社團組</b><small>社團資料</small><em v-if="terms">club-service</em></div>
    </div>
    <div class="phone" :class="{ off: !at(3) }">☎ 內線電話<em v-if="terms">OpenFeign</em></div>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.campus em { margin-left: 6px; padding: 0 8px; border-radius: 999px; background: #2f4550; color: #fff; font: 800 12px/1.7 var(--font-mono); font-style: normal; white-space: nowrap; }
.campus .off { visibility: hidden; }
.campus i { font-style: normal; }
.campus .dir { position: absolute; left: 250px; top: 0; width: 330px; padding: 8px 14px 10px; border: 3px solid #ce82ff; border-radius: 16px; background: #faf2ff; box-shadow: 0 4px 0 #a568cc; }
.slide .campus h4 { display: flex; align-items: center; gap: 6px; margin: 0 0 2px; font-size: 15.5px; font-weight: 900; color: #2b2b2b; white-space: nowrap; }
.campus .line { display: flex; justify-content: space-between; margin-top: 4px; padding: 1px 10px; border-radius: 9px; background: #fff; border: 2px solid #dcc6f2; font: 800 13.5px/1.8 var(--font-mono); color: #2b2b2b; }
.campus .line span { color: #7d3fb0; font-weight: 900; }
.campus .who { position: absolute; left: 0; top: 150px; width: 90px; display: flex; flex-direction: column; align-items: center; }
.campus .who b { font-size: 15px; font-weight: 900; }
.campus .gate { position: absolute; left: 110px; top: 132px; width: 240px; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 10px; border: 3px solid #ffc800; border-radius: 16px; background: #fff9db; box-shadow: 0 4px 0 #cd9f00; }
.campus .gate b { font-size: 15.5px; font-weight: 900; color: #2b2b2b; }
.campus .gate em { margin: 0; }
.campus .gate small { font-size: 13px; font-weight: 800; color: #5d6b74; white-space: nowrap; }
.campus .office { position: absolute; right: 0; width: 240px; display: flex; align-items: center; gap: 10px; padding: 8px 12px; border: 3px solid var(--c-brand); border-radius: 16px; background: #f1ffe4; box-shadow: 0 4px 0 var(--c-brand-dark); }
.campus .o1 { top: 112px; }
.campus .o2 { top: 216px; }
.campus .office b { display: block; font-size: 15.5px; font-weight: 900; color: #2b2b2b; }
.campus .office small { display: block; font-size: 13px; font-weight: 800; color: #5d6b74; }
.campus .office em { display: inline-block; margin: 2px 0 0; }
.campus .phone { position: absolute; right: 252px; top: 180px; padding: 3px 12px; border: 3px solid #1cb0f6; border-radius: 999px; background: #e8f7ff; color: #1378a8; font-size: 14px; font-weight: 900; white-space: nowrap; }
</style>
