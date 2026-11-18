import { reactive } from 'vue'
import { SUPABASE_KEY, SUPABASE_URL } from '../config'
import { PRIVILEGED, clientId, currentRole, emitLocal, on, receive, send, setRemote, type Envelope } from './sync'

/**
 * A classroom "room": devices that share a room code sync through Supabase Realtime.
 *
 * Trust model: the presenter owns an ECDSA key pair. The room code is a hash of the public key,
 * so anyone who knows the code can check that a control message (page turn, drawing, poll result…)
 * was signed by the presenter. Students only ever get the code; the private key travels only inside
 * the "phone remote" link. Unsigned or badly signed control messages are ignored.
 */
export const room = reactive({
  code: '',
  status: 'off' as 'off' | 'connecting' | 'on' | 'error',
  error: '',
  /** this device holds the presenter key */
  canControl: false,
  /** devices connected to the room, including this one */
  people: 0,
  /** audience only: follow the presenter's page turns */
  following: true,
  /** where the presenter is, for "catch up" after browsing freely */
  presenterAt: null as null | { course: string, ch: string, i: number, step: number },
  /** show the join QR on top of the slide (joinCode is the room it advertises) */
  showJoin: false,
  joinCode: '',
})

const STORE = 'deck-room-v1'
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const ALGO = { name: 'ECDSA', namedCurve: 'P-256' }
const SIGN = { name: 'ECDSA', hash: 'SHA-256' }
const enc = new TextEncoder()

let privateKey: CryptoKey | null = null
let publicKey: CryptoKey | null = null
let publicB64 = ''
let secret = ''
let channel: any = null
let client: any = null
let helloTimer: ReturnType<typeof setInterval> | undefined

const b64u = (buf: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(buf as ArrayBuffer))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const unb64u = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))

export const cryptoAvailable = () => typeof crypto !== 'undefined' && !!crypto.subtle

async function codeOf(pubRaw: Uint8Array): Promise<string> {
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', pubRaw as BufferSource))
  let bits = 0n
  for (let i = 0; i < 5; i++) bits = (bits << 8n) | BigInt(hash[i])
  let out = ''
  for (let i = 0; i < 8; i++) out = ALPHABET[Number((bits >> BigInt(i * 5)) & 31n)] + out
  return out
}

async function usePublic(b64: string, code: string): Promise<boolean> {
  try {
    const raw = unb64u(b64)
    if (await codeOf(raw) !== code) return false
    publicKey = await crypto.subtle.importKey('raw', raw as BufferSource, ALGO, true, ['verify'])
    publicB64 = b64
    return true
  }
  catch { return false }
}

/** secret = d.x.y of the private JWK */
async function useSecret(token: string, code: string): Promise<boolean> {
  try {
    const [d, x, y] = token.split('.')
    const raw = new Uint8Array([4, ...unb64u(x), ...unb64u(y)])
    if (!await usePublic(b64u(raw), code)) return false
    privateKey = await crypto.subtle.importKey('jwk', { kty: 'EC', crv: 'P-256', d, x, y, ext: true }, ALGO, false, ['sign'])
    secret = token
    return true
  }
  catch { return false }
}

function remember() {
  try { sessionStorage.setItem(STORE, JSON.stringify({ code: room.code, secret, pub: publicB64 })) }
  catch {}
}

export const normalizeCode = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)
const base = () => `${location.origin}${location.pathname}`
export const studentLink = (code = room.code) => `${base()}#/join/${code}`
export const remoteLink = () => `${base()}#/join/${room.code}/${secret}`
/** phones cannot open a localhost address */
export const isLocalAddress = () => ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)

// ---- outbound: serialised so signatures and order are preserved; chatty messages are thinned out ----
let queue: Promise<void> = Promise.resolve()
const pending = new Map<string, Envelope>()
let flushTimer: ReturnType<typeof setTimeout> | undefined
const THIN_MS = 160

function transmit(e: Envelope) {
  queue = queue.then(async () => {
    if (!channel || room.status !== 'on') return
    const p = JSON.stringify(e)
    const payload: Record<string, string> = { p }
    if (PRIVILEGED.has(e.t)) {
      if (!privateKey) return
      payload.s = b64u(await crypto.subtle.sign(SIGN, privateKey, enc.encode(p)))
      if (e.t === 'hello') payload.k = publicB64
    }
    await channel.send({ type: 'broadcast', event: 'm', payload })
  }).catch(() => {})
}

function post(e: Envelope) {
  if (PRIVILEGED.has(e.t) && !privateKey) return
  const thin = e.t === 'laser' ? 'laser' : e.t === 'draw-upsert' ? `draw:${e.stroke?.id}` : ''
  if (!thin) { transmit(e); return }
  pending.set(thin, e)
  flushTimer ??= setTimeout(() => {
    flushTimer = undefined
    const batch = [...pending.values()]
    pending.clear()
    batch.forEach(transmit)
  }, THIN_MS)
}

async function inbound(payload: any) {
  try {
    const p = String(payload?.p ?? '')
    const e = JSON.parse(p) as Envelope
    if (PRIVILEGED.has(e.t)) {
      if (!publicKey && e.t === 'hello' && payload.k && await usePublic(String(payload.k), room.code)) remember()
      if (!publicKey || !payload.s) return
      const ok = await crypto.subtle.verify(SIGN, publicKey, unb64u(String(payload.s)) as BufferSource, enc.encode(p))
      if (!ok) return
    }
    receive(e, true)
  }
  catch {}
}
let inboundQueue: Promise<void> = Promise.resolve()

function announce() {
  if (!room.canControl) return
  send({ t: 'hello' })
  send({ t: 'show-join', on: room.showJoin, code: room.code })
  // presenter pages answer `here` with their current slide
  emitLocal({ t: 'here' })
}

async function connect() {
  room.status = 'connecting'
  room.error = ''
  try {
    const { createClient } = await import('@supabase/supabase-js')
    client ??= createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
    const ch = client.channel(`deck-${room.code}`, { config: { broadcast: { self: false }, presence: { key: clientId } } })
    channel = ch
    ch.on('broadcast', { event: 'm' }, ({ payload }: any) => { inboundQueue = inboundQueue.then(() => inbound(payload)) })
    ch.on('presence', { event: 'sync' }, () => { room.people = Object.keys(ch.presenceState()).length })
    ch.on('presence', { event: 'join' }, () => announce())
    ch.subscribe((status: string) => {
      if (channel !== ch) return
      if (status === 'SUBSCRIBED') {
        room.status = 'on'
        setRemote(post)
        ch.track({ role: room.canControl ? 'presenter' : 'audience' })
        announce()
        clearInterval(helloTimer)
        helloTimer = setInterval(announce, 20000)
      }
      else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        room.status = 'error'
        room.error = '連不上即時服務，請檢查網路後再試一次。'
      }
    })
  }
  catch {
    room.status = 'error'
    room.error = '無法載入即時連線元件。'
  }
}

/** Presenter: open a new room on this device. */
export async function createRoom() {
  if (!cryptoAvailable()) { room.status = 'error'; room.error = '這個網址不是 https 或 localhost，瀏覽器不允許建立房間。'; return }
  await leaveRoom()
  const pair = await crypto.subtle.generateKey(ALGO, true, ['sign', 'verify'])
  const jwk = await crypto.subtle.exportKey('jwk', pair.privateKey)
  const raw = new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey))
  room.code = await codeOf(raw)
  await useSecret(`${jwk.d}.${jwk.x}.${jwk.y}`, room.code)
  room.canControl = true
  room.following = true
  remember()
  await connect()
}

/** Join an existing room. With `token` (from the phone-remote link) this device may control it. */
export async function joinRoom(code: string, token = '', pub = '') {
  if (!cryptoAvailable()) { room.status = 'error'; room.error = '這個網址不是 https 或 localhost，瀏覽器不允許加入房間。'; return }
  code = normalizeCode(code)
  if (room.code === code && room.status !== 'off' && room.status !== 'error' && (!token || room.canControl)) return
  await leaveRoom()
  room.code = code
  room.canControl = !!token && await useSecret(token, code)
  if (!room.canControl && pub) await usePublic(pub, code)
  room.following = true
  remember()
  await connect()
}

export async function leaveRoom() {
  clearInterval(helloTimer)
  setRemote(null)
  const ch = channel
  channel = null
  if (ch) { try { await client?.removeChannel(ch) } catch {} }
  privateKey = publicKey = null
  publicB64 = secret = ''
  Object.assign(room, { code: '', status: 'off', error: '', canControl: false, people: 0, following: true, presenterAt: null, showJoin: false, joinCode: '' })
  try { sessionStorage.removeItem(STORE) }
  catch {}
}

/** Re-join after a page reload (the room lives in sessionStorage for this tab). */
export function restoreRoom() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE) || 'null')
    if (saved?.code) joinRoom(saved.code, saved.secret || '', saved.pub || '')
  }
  catch {}
}

export function setShowJoin(on_: boolean) {
  room.showJoin = on_
  room.joinCode = room.code
  send({ t: 'show-join', on: on_, code: room.code })
}
// windows on the presenter's machine that are not in the room still show the QR
on('show-join', (m) => {
  room.showJoin = !!m.on
  room.joinCode = normalizeCode(String(m.code ?? ''))
})

export const isPresenterDevice = () => room.canControl || currentRole() === 'presenter'
