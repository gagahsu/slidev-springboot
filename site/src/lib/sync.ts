import { ref } from 'vue'

/**
 * Sync between the presenter window and audience windows.
 * Messages go through a Transport; today that is a BroadcastChannel (same browser, same machine).
 * A cross-device transport can be added later by implementing the same interface.
 */
export type Role = 'presenter' | 'audience'

export type Msg =
  | { t: 'hello' }
  | { t: 'here' }
  | { t: 'bye' }
  | { t: 'nav', ch: string, i: number }
  | { t: 'draw-upsert', key: string, stroke: any }
  | { t: 'draw-remove', key: string, id: string }
  | { t: 'draw-clear', key: string }
  | { t: 'laser', key: string, x: number, y: number, on: boolean }

type Envelope = Msg & { from: string, role: Role }

interface Transport {
  post: (e: Envelope) => void
  listen: (cb: (e: Envelope) => void) => void
}

function broadcastTransport(): Transport | null {
  if (typeof BroadcastChannel === 'undefined') return null
  const bc = new BroadcastChannel('deck-sync-v1')
  return {
    post: e => bc.postMessage(e),
    listen: (cb) => { bc.onmessage = ev => cb(ev.data) },
  }
}

const id = Math.random().toString(36).slice(2, 10)
const transport = broadcastTransport()
const handlers = new Map<string, Set<(m: any, e: Envelope) => void>>()

let role: Role = 'audience'
const presenterSeen = ref(0)
const audiences = new Map<string, number>()
/** audience: a presenter window is alive. presenter: number of audience windows alive. */
export const linked = ref(false)
export const audienceCount = ref(0)

const ALIVE_MS = 6000

function refresh() {
  const now = Date.now()
  linked.value = now - presenterSeen.value < ALIVE_MS
  for (const [k, seen] of audiences) if (now - seen > ALIVE_MS) audiences.delete(k)
  audienceCount.value = audiences.size
}

transport?.listen((e) => {
  if (!e || e.from === id) return
  if (e.role === 'presenter') presenterSeen.value = e.t === 'bye' ? 0 : Date.now()
  if (e.role === 'audience') {
    if (e.t === 'bye') audiences.delete(e.from)
    else audiences.set(e.from, Date.now())
  }
  if (e.t === 'hello' && role === 'audience') send({ t: 'here' })
  refresh()
  handlers.get(e.t)?.forEach(h => h(e, e))
})

export function send(msg: Msg) {
  transport?.post({ ...msg, from: id, role })
}

export function on<T extends Msg['t']>(type: T, handler: (m: Extract<Msg, { t: T }>, e: Envelope) => void): () => void {
  let set = handlers.get(type)
  if (!set) handlers.set(type, set = new Set())
  set.add(handler as any)
  return () => set!.delete(handler as any)
}

let beat: ReturnType<typeof setInterval> | undefined

/** Declare what this window is. Returns a cleanup function. */
export function join(as: Role): () => void {
  role = as
  clearInterval(beat)
  send(as === 'presenter' ? { t: 'hello' } : { t: 'here' })
  beat = setInterval(() => {
    send(role === 'presenter' ? { t: 'hello' } : { t: 'here' })
    refresh()
  }, 2000)
  const bye = () => send({ t: 'bye' })
  window.addEventListener('pagehide', bye)
  return () => {
    bye()
    clearInterval(beat)
    window.removeEventListener('pagehide', bye)
  }
}

export const currentRole = () => role
