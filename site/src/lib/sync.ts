import { ref } from 'vue'

/**
 * Messaging between presenter and audience windows/devices.
 * - local transport: BroadcastChannel (same browser, same machine), always on, trusted
 * - remote transport: plugged in by lib/room.ts when a classroom room is open (Supabase Realtime)
 */
export type Role = 'presenter' | 'audience'

export type Msg =
  | { t: 'hello' }
  | { t: 'here' }
  | { t: 'bye' }
  | { t: 'nav', ch: string, i: number, step?: number }
  | { t: 'draw-upsert', key: string, stroke: any }
  | { t: 'draw-remove', key: string, id: string }
  | { t: 'draw-clear', key: string }
  | { t: 'laser', key: string, x: number, y: number, on: boolean }
  | { t: 'show-join', on: boolean, code: string }
  | { t: 'poll-state', id: string, counts: number[] }
  | { t: 'vote', id: string, choice: number }
  | { t: 'ask', text: string }

export type Envelope = Msg & { from: string, role: Role, seq: number }
export interface Origin { remote: boolean }

/** Only a presenter may send these over the remote transport; room.ts signs and verifies them. */
export const PRIVILEGED = new Set<Msg['t']>(['hello', 'nav', 'draw-upsert', 'draw-remove', 'draw-clear', 'laser', 'show-join', 'poll-state'])

export const clientId = Math.random().toString(36).slice(2, 10)
const bc = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('deck-sync-v1')
let remotePost: ((e: Envelope) => void) | null = null
export function setRemote(post: ((e: Envelope) => void) | null) { remotePost = post }

const handlers = new Map<string, Set<(m: any, e: Envelope, o: Origin) => void>>()
const lastSeq = new Map<string, number>()
let seq = 0
let role: Role = 'audience'

let presenterSeen = 0
const audiences = new Map<string, number>()
/** audience: a presenter window in this browser is alive. presenter: audience windows alive in this browser. */
export const linked = ref(false)
export const audienceCount = ref(0)
const ALIVE_MS = 6000

function refresh() {
  const now = Date.now()
  linked.value = now - presenterSeen < ALIVE_MS
  for (const [k, seen] of audiences) if (now - seen > ALIVE_MS) audiences.delete(k)
  audienceCount.value = audiences.size
}

/** Entry point for every incoming message (room.ts calls it for verified remote messages). */
export function receive(e: Envelope, remote: boolean) {
  if (!e || e.from === clientId) return
  // the same message can arrive through both transports; also drops replays
  if (typeof e.seq === 'number') {
    if ((lastSeq.get(e.from) ?? 0) >= e.seq) return
    lastSeq.set(e.from, e.seq)
  }
  if (!remote) {
    if (e.role === 'presenter') presenterSeen = e.t === 'bye' ? 0 : Date.now()
    if (e.role === 'audience') {
      if (e.t === 'bye') audiences.delete(e.from)
      else audiences.set(e.from, Date.now())
    }
    if (e.t === 'hello' && role === 'audience') send({ t: 'here' }, true)
    refresh()
  }
  handlers.get(e.t)?.forEach(h => h(e, e, { remote }))
}

if (bc) bc.onmessage = ev => receive(ev.data, false)

export function send(msg: Msg, localOnly = false) {
  // plain copy: messages may carry reactive objects, which cannot be structured-cloned
  const e = JSON.parse(JSON.stringify({ ...msg, from: clientId, role, seq: ++seq })) as Envelope
  bc?.postMessage(e)
  if (!localOnly) remotePost?.(e)
}

/** Run the handlers of a message type in this window only (used for remote presence events). */
export function emitLocal(msg: Msg, remote = true) {
  const e = { ...msg, from: 'local', role, seq: 0 } as Envelope
  handlers.get(msg.t)?.forEach(h => h(e, e, { remote }))
}

export function on<T extends Msg['t']>(type: T, handler: (m: Extract<Msg, { t: T }>, e: Envelope, o: Origin) => void): () => void {
  let set = handlers.get(type)
  if (!set) handlers.set(type, set = new Set())
  set.add(handler as any)
  return () => set!.delete(handler as any)
}

let beat: ReturnType<typeof setInterval> | undefined

/** Declare what this window is. Returns a cleanup function. Heartbeats stay on the local transport. */
export function join(as: Role): () => void {
  role = as
  clearInterval(beat)
  const ping = () => send(role === 'presenter' ? { t: 'hello' } : { t: 'here' }, true)
  ping()
  beat = setInterval(() => { ping(); refresh() }, 2000)
  const bye = () => send({ t: 'bye' }, true)
  window.addEventListener('pagehide', bye)
  return () => {
    bye()
    clearInterval(beat)
    window.removeEventListener('pagehide', bye)
  }
}

export const currentRole = () => role
