import { reactive } from 'vue'
import { on, send } from './sync'

export type Tool = 'none' | 'pen' | 'marker' | 'arrow' | 'rect' | 'eraser' | 'laser'
export type ShapeTool = 'pen' | 'marker' | 'arrow' | 'rect'

export interface Stroke {
  id: string
  tool: ShapeTool
  color: string
  size: number
  /** flat x,y pairs in slide coordinates (980x552). arrow/rect use exactly two points. */
  pts: number[]
}

type Op =
  | { type: 'add', stroke: Stroke }
  | { type: 'remove', stroke: Stroke }
  | { type: 'clear', strokes: Stroke[] }

export const COLORS = ['#ff4b4b', '#ff9600', '#58cc02', '#1cb0f6', '#a855f7', '#2b2b2b']
export const SIZES = [3, 6, 10]

const KEY = 'deck-drawings-v1'

function load(): Record<string, Stroke[]> {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') }
  catch { return {} }
}

export const draw = reactive({
  tool: 'none' as Tool,
  color: COLORS[0],
  size: SIZES[1],
  pages: load(),
  laser: null as null | { key: string, x: number, y: number },
})

const history = new Map<string, { undo: Op[], redo: Op[] }>()
const hist = (key: string) => {
  let h = history.get(key)
  if (!h) history.set(key, h = { undo: [], redo: [] })
  return h
}

let saveTimer: ReturnType<typeof setTimeout> | undefined
function save() {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(draw.pages)) }
    catch {}
  }, 400)
}

export const strokesOf = (key: string) => draw.pages[key] ?? []
export const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

function put(key: string, stroke: Stroke) {
  const list = draw.pages[key] ?? (draw.pages[key] = [])
  const at = list.findIndex(s => s.id === stroke.id)
  if (at >= 0) list[at] = stroke
  else list.push(stroke)
  save()
}
function drop(key: string, id: string): Stroke | undefined {
  const list = draw.pages[key]
  const at = list?.findIndex(s => s.id === id) ?? -1
  if (at < 0) return
  const [removed] = list.splice(at, 1)
  if (!list.length) delete draw.pages[key]
  save()
  return removed
}

let lastSent = 0
/** Add or update a stroke while it is being drawn. `final` records it in the undo history. */
export function upsert(key: string, stroke: Stroke, final: boolean) {
  put(key, stroke)
  const now = Date.now()
  if (final || now - lastSent > 40) {
    lastSent = now
    send({ t: 'draw-upsert', key, stroke: { ...stroke, pts: [...stroke.pts] } })
  }
  if (final) {
    const h = hist(key)
    h.undo.push({ type: 'add', stroke })
    h.redo = []
  }
}

export function erase(key: string, id: string) {
  const removed = drop(key, id)
  if (!removed) return
  send({ t: 'draw-remove', key, id })
  const h = hist(key)
  h.undo.push({ type: 'remove', stroke: removed })
  h.redo = []
}

export function clearPage(key: string) {
  const strokes = draw.pages[key]
  if (!strokes?.length) return
  delete draw.pages[key]
  save()
  send({ t: 'draw-clear', key })
  const h = hist(key)
  h.undo.push({ type: 'clear', strokes: [...strokes] })
  h.redo = []
}

function addBack(key: string, stroke: Stroke) {
  put(key, stroke)
  send({ t: 'draw-upsert', key, stroke: { ...stroke, pts: [...stroke.pts] } })
}
function takeOut(key: string, stroke: Stroke) {
  drop(key, stroke.id)
  send({ t: 'draw-remove', key, id: stroke.id })
}

function apply(key: string, op: Op, inverse: boolean) {
  if (op.type === 'clear') {
    if (inverse) op.strokes.forEach(s => addBack(key, s))
    else op.strokes.forEach(s => takeOut(key, s))
  }
  else if ((op.type === 'add') !== inverse) addBack(key, op.stroke)
  else takeOut(key, op.stroke)
}

export function undo(key: string) {
  const h = hist(key)
  const op = h.undo.pop()
  if (!op) return
  apply(key, op, true)
  h.redo.push(op)
}
export function redo(key: string) {
  const h = hist(key)
  const op = h.redo.pop()
  if (!op) return
  apply(key, op, false)
  h.undo.push(op)
}
export const canUndo = (key: string) => (history.get(key)?.undo.length ?? 0) > 0
export const canRedo = (key: string) => (history.get(key)?.redo.length ?? 0) > 0

let laserSent = 0
export function pointLaser(key: string, x: number, y: number, on_: boolean) {
  draw.laser = on_ ? { key, x, y } : null
  const now = Date.now()
  if (!on_ || now - laserSent > 30) {
    laserSent = now
    send({ t: 'laser', key, x, y, on: on_ })
  }
}

// remote changes
on('draw-upsert', m => put(m.key, m.stroke))
on('draw-remove', m => { drop(m.key, m.id) })
on('draw-clear', (m) => { delete draw.pages[m.key]; save() })
on('laser', (m) => { draw.laser = m.on ? { key: m.key, x: m.x, y: m.y } : null })

// ---- geometry helpers ----
export function strokePath(s: Stroke): string {
  const p = s.pts
  if (p.length < 4) return `M${p[0]} ${p[1]}l0.01 0`
  let d = `M${p[0]} ${p[1]}`
  for (let i = 2; i < p.length - 2; i += 2) {
    const mx = (p[i] + p[i + 2]) / 2
    const my = (p[i + 1] + p[i + 3]) / 2
    d += `Q${p[i]} ${p[i + 1]} ${mx.toFixed(1)} ${my.toFixed(1)}`
  }
  return `${d}L${p[p.length - 2]} ${p[p.length - 1]}`
}

export function arrowHead(s: Stroke): string {
  const [x1, y1, x2, y2] = s.pts
  const a = Math.atan2(y2 - y1, x2 - x1)
  const len = 8 + s.size * 2.2
  const w = 0.42
  const f = (n: number) => n.toFixed(1)
  return `M${f(x2)} ${f(y2)}L${f(x2 - len * Math.cos(a - w))} ${f(y2 - len * Math.sin(a - w))}L${f(x2 - len * Math.cos(a + w))} ${f(y2 - len * Math.sin(a + w))}Z`
}

function distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = dx * dx + dy * dy
  const t = len ? Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len)) : 0
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
}

export function hits(s: Stroke, x: number, y: number): boolean {
  const reach = s.size / 2 + 7
  let p = s.pts
  if (s.tool === 'rect' && p.length >= 4) {
    const [x1, y1, x2, y2] = p
    p = [x1, y1, x2, y1, x2, y2, x1, y2, x1, y1]
  }
  if (p.length < 4) return Math.hypot(x - p[0], y - p[1]) <= reach
  for (let i = 0; i < p.length - 2; i += 2)
    if (distToSegment(x, y, p[i], p[i + 1], p[i + 2], p[i + 3]) <= reach) return true
  return false
}
