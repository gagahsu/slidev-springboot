<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, watch } from 'vue'
import { hidePoll, myVotes, polls, registerPoll, setRevealed, showPoll, vote } from '../lib/classroom'
import { room } from '../lib/room'
import { liveClass } from '../lib/settings'
import { SLIDE_KEY, useFixedSteps } from '../lib/steps'

/**
 * Classroom poll / quiz.
 *   <Poll question="IoC 把什麼交給容器？" options="物件的控制權|資料庫連線|程式碼版本" answer="1" />
 * Students tap an option on their own device; one step later the results (and the answer) are revealed.
 * With classroom interaction switched off (recorded lessons) it is a "think about it" quiz:
 * no vote counts, the next step simply marks the answer.
 */
const props = defineProps<{ question: string, options: string, answer?: string | number }>()
const slideKey = inject(SLIDE_KEY, null)
const id = `${slideKey?.value ?? 'slide'}:${props.question}`.slice(0, 120)
const opts = computed(() => props.options.split('|').map(o => o.trim()).filter(Boolean))
const correct = computed(() => props.answer ? Number(props.answer) - 1 : -1)
const { local, live } = useFixedSteps(1)
const revealed = computed(() => local.value >= 1)

onMounted(() => {
  registerPoll(id, opts.value.length)
  // only the slide on stage offers the answer pad, not previews or thumbnails
  if (live.value && liveClass.value) showPoll({ id, question: props.question, options: opts.value, answer: correct.value, revealed: revealed.value })
})
watch(revealed, r => setRevealed(id, r))
onBeforeUnmount(() => { if (live.value) hidePoll(id) })

const counts = computed(() => polls[id] ?? [])
const total = computed(() => counts.value.reduce((a, b) => a + b, 0))
const mine = computed(() => myVotes[id] ?? -1)
const pct = (n: number) => total.value ? Math.round((counts.value[n] ?? 0) / total.value * 100) : 0
const letters = 'ABCDEFGH'
</script>

<template>
  <div class="poll" :class="{ revealed, quiz: !liveClass }">
    <p v-if="!liveClass" class="think">想一想</p>
    <h3>{{ question }}</h3>
    <div class="options">
      <button
        v-for="(o, n) in opts" :key="n" class="option" type="button"
        :class="{ mine: mine === n, right: revealed && n === correct, wrong: revealed && correct >= 0 && mine === n && n !== correct }"
        :aria-pressed="mine === n" @click="vote(id, n)"
      >
        <i v-if="liveClass" class="bar" :style="{ width: revealed ? `${pct(n)}%` : '0%' }" />
        <span class="letter">{{ letters[n] }}</span>
        <span class="text">{{ o }}</span>
        <span v-if="revealed && liveClass" class="result">{{ pct(n) }}%<small>{{ counts[n] ?? 0 }} 票</small></span>
        <span v-else-if="revealed && n === correct" class="result picked">正確答案</span>
        <span v-else-if="revealed && mine === n" class="result picked">再想想</span>
        <span v-else-if="mine === n" class="result picked">已選</span>
      </button>
    </div>
    <p v-if="!liveClass" class="status">
      {{ revealed ? (mine < 0 || correct < 0 ? '答案公佈了，你猜對了嗎？' : mine === correct ? '答對了！' : '沒關係，看完說明再想一次。') : '先在心裡選一個答案 · 下一步公佈' }}
    </p>
    <p v-else class="status">
      <template v-if="room.status === 'on'">已作答 <b>{{ total }}</b> 人</template>
      <template v-else>點選一個答案</template>
      <template v-if="!revealed"> · 下一步公佈結果</template>
    </p>
  </div>
</template>

<style>
.slide .poll { margin: 10px 0 0; }
.slide .poll h3 { margin: 0 0 14px; font-size: 24px; font-weight: 900; color: #2b2b2b; }
.slide .poll .options { display: grid; gap: 10px; }
.slide .poll .option { position: relative; display: flex; align-items: center; gap: 14px; width: 100%; min-height: 54px; padding: 8px 16px; border: 2px solid var(--c-line); border-radius: 16px; box-shadow: 0 4px 0 var(--c-line); background: #fff; color: var(--c-ink); font: 800 18px/1.4 var(--font-sans); text-align: left; cursor: pointer; overflow: hidden; transition: transform .06s, box-shadow .06s, border-color .15s; }
.slide .poll .option:active { transform: translateY(3px); box-shadow: 0 1px 0 var(--c-line); }
.slide .poll .option:focus-visible { outline: 3px solid var(--c-blue); outline-offset: 2px; }
.slide .poll .option > * { position: relative; }
.slide .poll .bar { position: absolute; inset: 0 auto 0 0; background: var(--c-blue-soft); transition: width .7s cubic-bezier(.2, .8, .2, 1); }
.slide .poll .letter { flex: none; display: grid; place-items: center; width: 34px; height: 34px; border: 2px solid var(--c-line); border-radius: 10px; background: #fff; color: var(--c-ink-soft); font-size: 16px; font-weight: 900; }
.slide .poll .text { flex: 1; min-width: 0; }
.slide .poll .result { flex: none; display: flex; flex-direction: column; align-items: flex-end; font-size: 19px; font-weight: 900; line-height: 1.1; color: var(--c-blue-dark); }
.slide .poll .result small { font-size: 11.5px; font-weight: 800; color: var(--c-ink-soft); }
.slide .poll .result.picked { font-size: 14px; }
.slide .poll .option.mine { border-color: var(--c-blue); box-shadow: 0 4px 0 var(--c-blue-dark); }
.slide .poll .option.mine .letter { border-color: var(--c-blue); background: var(--c-blue); color: #fff; }
.slide .poll .option.right { border-color: var(--c-brand); box-shadow: 0 4px 0 var(--c-brand-dark); }
.slide .poll .option.right .bar { background: #d7ffb8; }
.slide .poll .option.right .letter { border-color: var(--c-brand); background: var(--c-brand); color: #fff; }
.slide .poll .option.right .result { color: var(--c-brand-dark); }
.slide .poll .option.wrong { border-color: #ff4b4b; box-shadow: 0 4px 0 #d33131; }
.slide .poll .option.wrong .letter { border-color: #ff4b4b; background: #ff4b4b; color: #fff; }
.slide .poll .think { display: inline-block; margin: 0 0 8px; padding: 3px 12px; border-radius: 999px; background: var(--c-blue-soft); color: var(--c-blue-dark); font-size: 14px; font-weight: 900; }
.slide .poll.quiz.revealed .option:not(.right):not(.wrong) { opacity: .55; }
.slide .poll.quiz .option.right .result, .slide .poll.quiz .option.wrong .result { font-size: 15px; }
.slide .poll.quiz .option.right { background: #f1ffe4; }
.slide .poll.quiz .option.wrong .result { color: #d33131; }
.slide .poll .status { margin: 14px 0 0; color: var(--c-ink-soft); font-size: 15px; font-weight: 800; }
.slide .poll .status b { color: var(--c-blue-dark); font-size: 18px; }
</style>
