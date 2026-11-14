<script setup lang="ts">
import { computed } from 'vue'
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

/**
 * Everyday story for HTTP: ordering at a bubble-tea shop.
 *   mode="chaos"    everyone orders their own way, so the shop introduces one order form
 *   mode="request"  the order form, filled in one box per step
 *   mode="response" the shop's reply slip
 *   mode="status"   four possible outcomes and whose problem each one is
 * Add `terms` to show the HTTP name of every part next to the everyday wording.
 */
const props = withDefaults(defineProps<{ mode?: 'chaos' | 'request' | 'response' | 'status', terms?: boolean }>(), { mode: 'request', terms: false })

const slips = {
  request: {
    title: '點單', from: '客人 → 店員', term: 'Http Request',
    rows: [
      { q: '我要做什麼', a: '點一杯新的', term: 'Http Method', ex: 'POST' },
      { q: '找哪個品項', a: '珍珠奶茶', term: 'URL', ex: '/drinks/milk-tea' },
      { q: '備註', a: '少冰、半糖', term: 'Header', ex: 'Content-Type: application/json' },
      { q: '詳細內容', a: '大杯、加椰果', term: 'Body', ex: '{"size":"L","topping":"椰果"}' },
    ],
  },
  response: {
    title: '取餐單', from: '店員 → 客人', term: 'Http Response',
    rows: [
      { q: '結果', a: '做好了！', term: 'Status Code', ex: '200 OK' },
      { q: '備註', a: '小心冰，盡快喝完', term: 'Header', ex: 'Content-Type: application/json' },
      { q: '你要的東西', a: '珍珠奶茶一杯', term: 'Body', ex: '{"drink":"珍珠奶茶","size":"L"}' },
    ],
  },
}
const outcomes = [
  { art: 'ok', say: '「做好了！」', who: '一切順利', code: '200', name: 'OK', tone: 'good' },
  { art: 'what', say: '「我們沒有賣這個」', who: '客人這邊的問題', code: '404', name: 'Not Found', tone: 'warn' },
  { art: 'what', say: '「點單寫錯了，看不懂」', who: '客人這邊的問題', code: '400', name: 'Bad Request', tone: 'warn' },
  { art: 'no', say: '「抱歉，機器壞了」', who: '店家這邊的問題', code: '500', name: 'Internal Server Error', tone: 'bad' },
]

const slip = computed(() => props.mode === 'request' || props.mode === 'response' ? slips[props.mode] : null)
const stepCount = { chaos: 2, request: 4, response: 3, status: 4 }[props.mode]
const { local, live } = useFixedSteps(stepCount)
const shown = (n: number) => !live.value || local.value > n

const captions = computed(() => {
  const t = props.terms
  switch (props.mode) {
    case 'chaos': return ['每個客人都用自己的方式點飲料', '店員完全聽不懂，一杯都做不出來', '所以店家規定：通通照同一張點單寫']
    case 'request': return t
      ? ['Http Request 就是前端交給後端的「點單」', '第一格是 Http Method：這次要做什麼動作', '第二格是 URL：要找後端的哪一個功能', '第三格是 Header：附加的備註資訊', '第四格是 Body：要一起送過去的詳細資料']
      : ['一張點單有四格，客人一格一格填', '第一格：我要做什麼', '第二格：要找哪個品項', '第三格：有什麼備註', '第四格：詳細內容。填好就交給店員']
    case 'response': return t
      ? ['Http Response 就是後端交回前端的「取餐單」', '第一格是 Status Code：這次請求的結果', '第二格是 Header：附加的備註資訊', '第三格是 Body：後端真正要給你的資料']
      : ['店員做完之後，也會交回一張取餐單', '第一格：結果如何', '第二格：有什麼要提醒你的', '第三格：你要的東西']
    default: return t
      ? ['結果用一個三位數字表示，叫做 Status Code', '2 開頭：成功', '4 開頭：前端（發請求的人）的問題', '同樣是 4 開頭：請求的格式寫錯了', '5 開頭：後端（伺服器）自己出錯']
      : ['點了飲料，不一定每次都拿得到', '最好的情況：順利做好', '店裡根本沒有這個品項', '點單寫得亂七八糟', '店裡的機器壞了，不是你的錯']
  }
})
</script>

<template>
  <div class="anim-stage drink-shop" :class="[mode, { terms }]">
    <template v-if="mode === 'chaos'">
      <div class="who c1"><Art name="customer" size="96" /><i class="say">「那個…綠綠的那個！」</i></div>
      <div class="who c2"><Art name="you" size="96" /><i class="say">「老樣子！」</i></div>
      <div class="who c3"><Art name="teacher" size="96" /><i class="say">「隨便來一杯」</i></div>
      <div class="store"><Art name="shop" size="170" /><Art class="clerk" name="clerk" size="92" /><b>飲料店</b></div>
      <Art v-if="local === 1" class="mark" name="what" size="76" />
      <div class="rule" :class="{ 'step-hidden': live && local < 2 }"><Art name="form" size="92" /><b>統一的點單</b><Art class="tick" name="ok" size="40" /></div>
    </template>

    <template v-else-if="slip">
      <div class="who side-l"><Art :name="terms ? 'browser' : 'customer'" size="112" /><b>{{ terms ? '前端' : '客人' }}</b></div>
      <div class="store side-r"><Art :name="terms ? 'server' : 'shop'" :size="terms ? 112 : 150" /><Art v-if="!terms" class="clerk" name="clerk" size="80" /><b>{{ terms ? '後端' : '飲料店' }}</b></div>
      <div class="slip" :class="mode">
        <h5>{{ terms ? slip.term : slip.title }}<small>{{ terms ? (mode === 'request' ? '前端 → 後端' : '後端 → 前端') : slip.from }}</small></h5>
        <div v-for="(r, n) in slip.rows" :key="n" class="row" :class="{ off: !shown(n) }">
          <span class="q">{{ r.q }}</span>
          <span class="a"><Art v-if="mode === 'response' && n === 2" name="cup" size="30" />{{ r.a }}</span>
          <span v-if="terms" class="t"><b>{{ r.term }}</b><code>{{ r.ex }}</code></span>
        </div>
      </div>
    </template>

    <div v-else class="outcomes">
      <div v-for="(o, n) in outcomes" :key="n" class="outcome" :class="[o.tone, { off: !shown(n) }]">
        <Art :name="o.art" size="52" />
        <div class="txt"><b>{{ o.say }}</b><small>{{ terms ? o.who.replace('客人這邊', '前端').replace('店家這邊', '後端') : o.who }}</small></div>
        <div v-if="terms" class="code"><b>{{ o.code }}</b><small>{{ o.name }}</small></div>
      </div>
    </div>

    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[Math.min(local, captions.length - 1)] }}</p>
  </div>
</template>

<style>
.drink-shop b { font-weight: 900; color: #2b2b2b; }
.drink-shop .who, .drink-shop .store { position: absolute; display: flex; flex-direction: column; align-items: center; font-size: 15px; }
.drink-shop .store .clerk { position: absolute; left: 50%; top: 42%; margin-left: -46px; }
.drink-shop .side-l { left: 4px; top: 86px; }
.drink-shop .side-r { right: 0; top: 62px; }
.drink-shop.terms .side-r { top: 86px; }
.drink-shop .side-r .clerk { margin-left: -40px; }

/* chaos */
.drink-shop .c1 { left: 20px; top: 4px; } .drink-shop .c2 { left: 150px; top: 100px; } .drink-shop .c3 { left: 20px; top: 196px; }
.drink-shop .say { position: absolute; left: 92px; top: 8px; padding: 6px 12px; border: 3px solid #ff9600; border-radius: 16px 16px 16px 4px; background: #fff; color: #a35f00; font-size: 15px; font-style: normal; font-weight: 900; white-space: nowrap; }
.drink-shop.chaos .store { right: 20px; top: 40px; }
.drink-shop .mark { position: absolute; right: 150px; top: 10px; animation: drink-wobble .5s ease-in-out infinite alternate; }
@keyframes drink-wobble { from { transform: rotate(-10deg); } to { transform: rotate(10deg); } }
.drink-shop .rule { position: absolute; left: 400px; top: 150px; display: flex; flex-direction: column; align-items: center; padding: 10px 22px; border: 3px solid var(--c-brand); border-radius: 20px; box-shadow: 0 5px 0 var(--c-brand-dark); background: #f1fde6; font-size: 17px; transition: opacity .4s; }
.drink-shop .rule .tick { position: absolute; right: -16px; top: -16px; }

/* order form / reply slip */
.drink-shop .slip { position: absolute; left: 150px; right: 170px; top: 6px; padding: 10px 14px 12px; border: 3px solid #ff9600; border-radius: 18px; box-shadow: 0 5px 0 #cd7900; background: #fff; }
.drink-shop.terms .slip { left: 128px; right: 128px; }
.drink-shop .slip.response { border-color: var(--c-brand); box-shadow: 0 5px 0 var(--c-brand-dark); top: 26px; }
.drink-shop .slip h5 { display: flex; align-items: baseline; gap: 10px; margin: 0 0 8px; font-size: 19px; font-weight: 900; color: #2b2b2b; }
.drink-shop .slip h5 small { color: var(--c-ink-soft); font-size: 12.5px; font-weight: 800; }
.drink-shop .row { display: flex; align-items: center; gap: 10px; min-height: 46px; margin-top: 7px; padding: 4px 10px; border: 2px dashed #ffd28a; border-radius: 12px; transition: opacity .35s, transform .35s, background-color .35s; }
.drink-shop .slip.response .row { border-color: #b7e88a; }
.drink-shop .row .q { flex: none; width: 96px; padding: 3px 0; border-radius: 9px; background: #ffeccf; color: #a35f00; font-size: 14px; font-weight: 900; text-align: center; }
.drink-shop .slip.response .row .q { background: #e5f9d3; color: var(--c-brand-dark); }
.drink-shop .row .a { flex: 1; display: flex; align-items: center; gap: 6px; min-width: 0; font-size: 17px; font-weight: 800; color: #2b2b2b; }
.drink-shop .row .t { flex: none; display: flex; flex-direction: column; align-items: flex-end; max-width: 250px; line-height: 1.3; }
.drink-shop .row .t b { color: var(--c-blue-dark); font-size: 14px; }
.drink-shop .row .t code { max-width: 100%; padding: 0 6px; border-radius: 6px; background: var(--c-blue-soft); color: #1478b8; font: 700 11.5px/1.5 var(--font-mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.drink-shop .row.off .a, .drink-shop .row.off .t { opacity: 0; transform: translateX(-10px); }
.drink-shop .row .a, .drink-shop .row .t { transition: opacity .35s, transform .35s; }

/* outcomes */
.drink-shop .outcomes { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding-top: 8px; }
.drink-shop .outcome { display: flex; align-items: center; gap: 14px; min-height: 118px; padding: 10px 16px; border: 3px solid var(--c-brand); border-radius: 20px; box-shadow: 0 5px 0 var(--c-brand-dark); background: #f1fde6; transition: opacity .35s, transform .35s; }
.drink-shop .outcome.warn { border-color: #ff9600; box-shadow: 0 5px 0 #cd7900; background: #fff6e6; }
.drink-shop .outcome.bad { border-color: #ff4b4b; box-shadow: 0 5px 0 #d33131; background: #fff0f0; }
.drink-shop .outcome.off { opacity: 0; transform: translateY(12px); }
.drink-shop .outcome .txt { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.drink-shop .outcome .txt b { font-size: 18px; line-height: 1.35; }
.drink-shop .outcome .txt small { margin-top: 4px; align-self: flex-start; padding: 1px 10px; border-radius: 999px; background: rgba(0, 0, 0, .07); color: var(--c-ink); font-size: 13px; font-weight: 800; }
.drink-shop .outcome .code { flex: none; display: flex; flex-direction: column; align-items: center; }
.drink-shop .outcome .code b { font: 900 30px/1.1 var(--font-mono); color: var(--c-blue-dark); }
.drink-shop .outcome .code small { max-width: 110px; color: var(--c-ink-soft); font-size: 11px; font-weight: 800; text-align: center; line-height: 1.25; }
</style>
