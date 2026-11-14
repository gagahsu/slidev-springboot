import { reactive } from 'vue'
import { room } from './room'
import { clientId, on, send } from './sync'

/**
 * Polls and student questions. Nothing is stored on a server: presenter devices tally the votes they
 * receive and broadcast the totals, so results last as long as the presenter's tab.
 */
export const polls = reactive<Record<string, number[]>>({})
export const myVotes = reactive<Record<string, number>>({})
/** polls on the slide that is currently shown, so small screens can offer a full-size answer pad */
export interface ActivePoll { id: string, question: string, options: string[], answer: number, revealed: boolean }
export const activePolls = reactive<ActivePoll[]>([])
export function showPoll(p: ActivePoll) {
  hidePoll(p.id)
  activePolls.push(p)
}
export function hidePoll(id: string) {
  const at = activePolls.findIndex(p => p.id === id)
  if (at >= 0) activePolls.splice(at, 1)
}
export function setRevealed(id: string, revealed: boolean) {
  const p = activePolls.find(p => p.id === id)
  if (p) p.revealed = revealed
}
export const questions = reactive<{ id: string, text: string, at: number, done: boolean }[]>([])

const ballots = new Map<string, Map<string, number>>()
const timers = new Map<string, ReturnType<typeof setTimeout>>()

function tally(id: string, size: number) {
  const counts = Array.from({ length: size }, () => 0)
  for (const c of ballots.get(id)?.values() ?? []) if (c >= 0 && c < size) counts[c]++
  polls[id] = counts
  if (room.canControl && !timers.has(id)) {
    timers.set(id, setTimeout(() => {
      timers.delete(id)
      send({ t: 'poll-state', id, counts: polls[id] })
    }, 700))
  }
}

function record(id: string, voter: string, choice: number, size: number) {
  let b = ballots.get(id)
  if (!b) ballots.set(id, b = new Map())
  b.set(voter, choice)
  tally(id, size)
}

const sizes = new Map<string, number>()
/** A poll component announces itself so incoming votes can be validated. */
export function registerPoll(id: string, size: number) {
  sizes.set(id, size)
  if (!polls[id]) polls[id] = Array.from({ length: size }, () => 0)
}

export function vote(id: string, choice: number) {
  const size = sizes.get(id) ?? 0
  if (choice < 0 || choice >= size) return
  myVotes[id] = choice
  const inClass = room.status === 'on' && !room.canControl
  if (inClass) send({ t: 'vote', id, choice })
  else record(id, clientId, choice, size)
}

on('vote', (m, e) => {
  const size = sizes.get(m.id)
  // only presenter devices count; they must have the poll on screen to know its options
  if (!room.canControl || !size || !Number.isInteger(m.choice)) return
  record(m.id, e.from, m.choice, size)
})
on('poll-state', (m) => {
  if (room.canControl) return
  if (Array.isArray(m.counts) && m.counts.length <= 12) polls[m.id] = m.counts.map(n => Math.max(0, Number(n) || 0))
})

let lastAsk = 0
/** Student: send a question to the presenter. Returns false when asking too quickly. */
export function ask(text: string): boolean {
  const clean = text.trim().slice(0, 200)
  if (!clean || Date.now() - lastAsk < 8000) return false
  lastAsk = Date.now()
  send({ t: 'ask', text: clean })
  return true
}
on('ask', (m, e) => {
  if (typeof m.text !== 'string' || !m.text.trim()) return
  if (questions.length >= 200) questions.shift()
  questions.push({ id: `${e.from}-${e.seq}`, text: m.text.slice(0, 200), at: Date.now(), done: false })
})
