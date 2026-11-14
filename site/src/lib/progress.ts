import { reactive, watch } from 'vue'

interface Progress {
  last: { ch: string, i: number } | null
  /** furthest slide index reached per chapter */
  seen: Record<string, number>
}

const KEY = 'deck-progress-v1'

function read(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { last: null, seen: {}, ...JSON.parse(raw) }
  }
  catch {}
  return { last: null, seen: {} }
}

export const progress = reactive<Progress>(read())

watch(progress, (p) => {
  try { localStorage.setItem(KEY, JSON.stringify(p)) }
  catch {}
}, { deep: true })

export function visit(ch: string, i: number) {
  progress.last = { ch, i }
  if ((progress.seen[ch] ?? -1) < i) progress.seen[ch] = i
}
