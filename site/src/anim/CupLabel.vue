<script setup lang="ts">
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch15 story: the clerk can only shout one sentence; the customer wants several facts about
// the drink, so the shop sticks a label on the cup ("item: content" per line) = JSON.
const { local, live } = useFixedSteps(3)
const at = (n: number) => !live.value || local.value >= n
const rows = [
  { k: '品名', v: '珍珠奶茶', key: '"name"', val: '"珍珠奶茶"' },
  { k: '價格', v: '50', key: '"price"', val: '50' },
  { k: '加冰', v: '是', key: '"ice"', val: 'true' },
]
const captions = ['現在店員只會喊一句話', '可是客人想知道的不只一件事', '店家在杯子上貼一張標籤：每一行都是「項目：內容」', '把標籤照固定的寫法寫下來，就是 JSON']
</script>

<template>
  <div class="anim-stage cup-label">
    <div class="clerk">
      <Art name="clerk" size="80" />
      <i class="say">「珍珠奶茶一杯」</i>
    </div>
    <div class="asks" :class="{ off: !at(1), faded: at(2) }">
      <i>多少錢？</i><i>有加冰嗎？</i><i>這杯是什麼？</i>
    </div>
    <div class="cup" :class="{ off: !at(2) }">
      <Art name="cup" size="70" />
      <div class="label">
        <b>標籤</b>
        <p v-for="r in rows" :key="r.k"><span>{{ r.k }}</span>：{{ r.v }}</p>
      </div>
    </div>
    <div class="arrow" :class="{ off: !at(3) }">照格式寫</div>
    <pre class="json" :class="{ off: !at(3) }">{
<template v-for="(r, n) in rows" :key="r.k">  <em>{{ r.key }}</em>: <strong>{{ r.val }}</strong>{{ n < rows.length - 1 ? ',' : '' }}
</template>}</pre>
    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.cup-label .off { visibility: hidden; }
.cup-label i { font-style: normal; font-weight: 900; }
.cup-label .clerk { position: absolute; left: 0; top: 40px; display: flex; flex-direction: column; align-items: center; width: 170px; }
.cup-label .say { margin-top: 8px; padding: 6px 12px; border: 2px solid var(--c-line); border-radius: 14px; background: #fff; font-size: 15px; white-space: nowrap; }
.cup-label .asks { position: absolute; left: 6px; top: 196px; display: flex; flex-wrap: wrap; gap: 6px; width: 190px; transition: opacity .3s; }
.cup-label .asks.faded { opacity: .45; }
.cup-label .asks i { padding: 2px 10px; border-radius: 999px; background: #fff3c4; border: 2px solid #ffc800; color: #8a6d00; font-size: 13.5px; }
.cup-label .cup { position: absolute; left: 220px; top: 34px; display: flex; align-items: center; gap: 6px; }
.cup-label .label { width: 190px; padding: 10px 16px 12px; border: 3px solid #ce82ff; border-radius: 16px; box-shadow: 0 4px 0 #a568cc; background: #faf2ff; }
.cup-label .label b { display: block; margin-bottom: 4px; color: #7d3fb0; font-size: 14px; font-weight: 900; }
.cup-label .label p { margin: 0; font-size: 17px; font-weight: 800; line-height: 1.7; color: #2b2b2b; }
.cup-label .label span { color: #7d3fb0; }
.cup-label .arrow { position: absolute; left: 506px; top: 108px; width: 84px; padding-bottom: 8px; border-bottom: 6px solid var(--c-blue); color: var(--c-blue-dark); font-size: 13.5px; font-weight: 900; text-align: center; }
.cup-label .arrow::after { content: ''; position: absolute; right: -8px; bottom: -13px; border: 10px solid transparent; border-left: 12px solid var(--c-blue); border-right: 0; }
.slide .cup-label .json { position: absolute; left: 612px; top: 40px; width: 262px; margin: 0; padding: 14px 16px; border: 3px solid var(--c-blue); border-radius: 16px; box-shadow: 0 4px 0 var(--c-blue-dark); background: #f2fbff; color: #2b2b2b; font: 700 16.5px/1.75 var(--font-mono); white-space: pre; }
.cup-label .json em { font-style: normal; color: #7d3fb0; }
.cup-label .json strong { color: var(--c-brand-dark); }
</style>
