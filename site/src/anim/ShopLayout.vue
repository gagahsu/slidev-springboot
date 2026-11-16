<script setup lang="ts">
import { computed } from 'vue'
import { useFixedSteps } from '../lib/steps'
import Art from './Art.vue'

// ch12 story: a bubble-tea shop has a front (menu board + counter, what the customer sees)
// and a bar in the back (machines, ingredients; customers may not enter).
//   mode="zones": front = frontend, bar = backend, ordering at the counter = API
//   mode="mvc":   who does what = Controller / Model / View
// `terms` adds the programming names next to the story labels.
const props = withDefaults(defineProps<{ mode?: 'zones' | 'mvc', terms?: boolean }>(), { mode: 'zones' })
const mvc = computed(() => props.mode === 'mvc')
const { local, live } = useFixedSteps(3)
const at = (n: number) => !live.value || local.value >= n
const only = (n: number) => live.value && local.value === n

const captions = computed(() => mvc.value
  ? ['一杯飲料，是三個角色分工做出來的', '櫃台店員：接單，再把單子交給後面', '吧台：照著做法、用材料，真的把飲料做出來', '做好的飲料：客人最後拿到手上的東西']
  : ['小明走進一間手搖飲店', '店面：菜單看板和櫃台，客人看得到、摸得到', '吧台：機器和材料都在後面，客人看不到', '客人不能自己進吧台，只能在櫃台點單'])
</script>

<template>
  <div class="anim-stage shop-layout" :class="[mode, `s${local}`]">
    <div class="me" :class="{ blocked: !mvc && at(3) }">
      <Art name="customer" size="84" />
      <b>小明</b>
    </div>

    <div class="zone front" :class="{ hot: !mvc && only(1) }">
      <span v-if="!mvc" class="label" :class="{ off: !at(1) }">店面　客人看得到<em v-if="terms">前端</em></span>
      <div class="clerk" :class="{ hot: mvc && only(1) || !mvc && only(3) }">
        <Art name="clerk" size="80" />
        <b>櫃台店員</b>
        <i v-if="mvc" class="tag" :class="{ off: !at(1) }">接單、轉交<em v-if="terms">Controller</em></i>
        <i v-else class="tag" :class="{ off: !at(3) }">在這裡點單<em v-if="terms">API</em></i>
      </div>
      <div class="menu" :class="{ dim: mvc }">
        <b>菜單</b>
        <i>珍珠奶茶　50</i><i>綠茶　　　30</i><i>紅茶拿鐵　55</i>
      </div>
    </div>

    <div class="wall" :class="{ off: mvc || !at(3) }"><span>客人止步</span></div>

    <div class="zone bar" :class="{ hot: mvc ? only(2) : only(2) }">
      <span v-if="!mvc" class="label" :class="{ off: !at(2) }">吧台　客人看不到<em v-if="terms">後端</em></span>
      <div class="gear">
        <div><Art name="machine" size="74" /><b>機器和做法</b></div>
        <div><Art name="backpack" size="62" /><b>材料</b></div>
      </div>
      <i v-if="mvc" class="tag" :class="{ off: !at(2) }">真的把飲料做出來<em v-if="terms">Model</em></i>
    </div>

    <div v-if="mvc" class="drink" :class="{ off: !at(3), hot: only(3) }">
      <Art name="cup" size="60" />
      <i class="tag">拿到手上的飲料<em v-if="terms">View</em></i>
    </div>
    <div v-if="!mvc" class="order" :class="{ off: !at(3) }"><span>點單</span></div>

    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.shop-layout b { font-weight: 900; color: #2b2b2b; font-size: 15px; }
.shop-layout .off { visibility: hidden; }
.shop-layout em { margin-left: 8px; padding: 0 8px; border-radius: 999px; background: #fff; color: var(--c-blue-dark); font-style: normal; font-size: 12.5px; }
.shop-layout .tag { display: inline-block; margin-top: 6px; padding: 2px 12px; border-radius: 999px; border: 2px solid #ffc800; background: #fff3c4; color: #8a6d00; font-size: 13.5px; font-style: normal; font-weight: 900; white-space: nowrap; }
.shop-layout .me { position: absolute; left: 6px; top: 96px; display: flex; flex-direction: column; align-items: center; width: 100px; }
.shop-layout .zone { position: absolute; top: 26px; height: 250px; border: 3px solid var(--c-line); border-radius: 20px; box-shadow: 0 4px 0 var(--c-line); background: #fff; transition: border-color .3s, box-shadow .3s, background-color .3s; }
.shop-layout .zone .label { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); padding: 3px 14px; border-radius: 999px; color: #fff; font-size: 14.5px; font-weight: 900; white-space: nowrap; }
.shop-layout .front { left: 196px; width: 334px; display: flex; align-items: center; justify-content: space-around; padding: 14px 10px 0; }
.shop-layout .front .label { background: var(--c-blue); }
.shop-layout .front.hot { border-color: var(--c-blue); box-shadow: 0 4px 0 var(--c-blue-dark); background: #f2fbff; }
.shop-layout .bar { left: 590px; width: 280px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 10px; background: #f7f7f7; }
.shop-layout .bar .label { background: #ce82ff; }
.shop-layout .bar.hot { border-color: #ce82ff; box-shadow: 0 4px 0 #a568cc; background: #faf2ff; }
.shop-layout .menu { display: flex; flex-direction: column; gap: 3px; width: 150px; padding: 10px 12px 12px; border-radius: 12px; background: #3c3c3c; transition: opacity .3s; }
.shop-layout .menu.dim { opacity: .45; }
.shop-layout .menu b { color: #ffc800; text-align: center; font-size: 16px; }
.shop-layout .menu i { color: #fff; font: 700 12.5px/1.6 var(--font-sans); font-style: normal; white-space: pre; }
.shop-layout .clerk { display: flex; flex-direction: column; align-items: center; padding: 6px 8px; border: 3px solid transparent; border-radius: 16px; transition: border-color .3s, background-color .3s; }
.shop-layout .clerk.hot { border-color: #ffc800; background: #fffbea; }
.shop-layout .gear { display: flex; align-items: flex-end; gap: 22px; }
.shop-layout .gear > div { display: flex; flex-direction: column; align-items: center; }
.shop-layout .wall { position: absolute; left: 548px; top: 30px; width: 14px; height: 246px; border-radius: 7px; background: repeating-linear-gradient(135deg, #ff4b4b 0 12px, #fff 12px 24px); border: 2px solid #ff4b4b; }
.shop-layout .wall span { position: absolute; left: 50%; top: -22px; transform: translateX(-50%); padding: 1px 10px; border-radius: 999px; background: #ff4b4b; color: #fff; font-size: 12.5px; font-weight: 900; white-space: nowrap; }
.shop-layout .order { position: absolute; left: 104px; top: 150px; width: 104px; height: 6px; border-radius: 3px; background: #ffc800; }
.shop-layout .order::after { content: ''; position: absolute; right: -6px; top: -7px; border: 10px solid transparent; border-left: 12px solid #ffc800; border-right: 0; }
.shop-layout .order span { position: absolute; left: 30px; top: -26px; color: #8a6d00; font-size: 13px; font-weight: 900; }
.shop-layout .drink { position: absolute; left: 0; top: 196px; display: flex; flex-direction: column; align-items: center; width: 150px; }
.shop-layout.mvc .me { top: 40px; left: 22px; }
.shop-layout .drink .tag { margin-top: 0; }
</style>
