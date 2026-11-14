<script setup lang="ts">
import { computed } from 'vue'
import { myVotes, polls, vote, type ActivePoll } from '../lib/classroom'

// Full-size version of the poll on the current slide, for phones where the slide itself is tiny.
const props = defineProps<{ poll: ActivePoll }>()
const counts = computed(() => polls[props.poll.id] ?? [])
const total = computed(() => counts.value.reduce((a, b) => a + b, 0))
const mine = computed(() => myVotes[props.poll.id] ?? -1)
const pct = (n: number) => total.value ? Math.round((counts.value[n] ?? 0) / total.value * 100) : 0
const letters = 'ABCDEFGH'
</script>

<template>
  <section class="poll-pad" aria-label="作答區">
    <h3>{{ poll.question }}</h3>
    <button
      v-for="(o, n) in poll.options" :key="n" type="button" class="opt"
      :class="{ mine: mine === n, right: poll.revealed && n === poll.answer, wrong: poll.revealed && poll.answer >= 0 && mine === n && n !== poll.answer }"
      :aria-pressed="mine === n" @click="vote(poll.id, n)"
    >
      <span class="letter">{{ letters[n] }}</span>
      <span class="text">{{ o }}</span>
      <span v-if="poll.revealed" class="pct">{{ pct(n) }}%</span>
    </button>
    <p>{{ poll.revealed ? `共 ${total} 人作答` : mine >= 0 ? '已送出，可以改選。等老師公佈結果。' : '點一個答案' }}</p>
  </section>
</template>

<style scoped>
.poll-pad { padding: 14px; border: 2px solid var(--c-line); border-radius: 18px; background: var(--c-snow); }
h3 { margin: 0 0 12px; font-size: 17px; font-weight: 900; line-height: 1.45; color: #2b2b2b; }
.opt { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 52px; margin-bottom: 10px; padding: 8px 14px; border: 2px solid var(--c-line); border-radius: 14px; box-shadow: 0 3px 0 var(--c-line); background: #fff; color: var(--c-ink); font: 800 16px/1.4 var(--font-sans); text-align: left; cursor: pointer; }
.opt:active { transform: translateY(3px); box-shadow: none; }
.opt:focus-visible { outline: 3px solid var(--c-blue); outline-offset: 2px; }
.letter { flex: none; display: grid; place-items: center; width: 32px; height: 32px; border: 2px solid var(--c-line); border-radius: 10px; color: var(--c-ink-soft); font-weight: 900; }
.text { flex: 1; min-width: 0; }
.pct { flex: none; font-weight: 900; color: var(--c-blue-dark); }
.opt.mine { border-color: var(--c-blue); box-shadow: 0 3px 0 var(--c-blue-dark); }
.opt.mine .letter { border-color: var(--c-blue); background: var(--c-blue); color: #fff; }
.opt.right { border-color: var(--c-brand); box-shadow: 0 3px 0 var(--c-brand-dark); background: #f1fde6; }
.opt.right .letter { border-color: var(--c-brand); background: var(--c-brand); color: #fff; }
.opt.wrong { border-color: #ff4b4b; box-shadow: 0 3px 0 #d33131; }
.opt.wrong .letter { border-color: #ff4b4b; background: #ff4b4b; color: #fff; }
p { margin: 2px 0 0; color: var(--c-ink-soft); font-size: 13.5px; font-weight: 700; }
</style>
