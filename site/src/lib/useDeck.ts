import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { chapterAt, chapterById, loadChapter, type Slide } from './deck'
import { clearPage, draw, redo, undo } from './draw'
import { visit } from './progress'
import { join, linked, on, send, type Role } from './sync'
import { unitOf } from './units'

/** Shared state and navigation for the audience (Deck) and presenter pages. */
export function useDeck(role: Role) {
  const prefix = role === 'presenter' ? '/presenter' : ''
  const route = useRoute()
  const router = useRouter()

  const chId = computed(() => String(route.params.ch))
  const chapter = computed(() => chapterById(chId.value))
  const slides = shallowRef<Slide[]>([])
  const loading = ref(true)
  const index = computed(() => {
    const n = Number(route.params.n || 1) - 1
    const max = Math.max(0, (chapter.value?.count ?? 1) - 1)
    return Math.min(Math.max(0, Number.isFinite(n) ? n : 0), max)
  })
  const slide = computed(() => slides.value[index.value])
  const unit = computed(() => unitOf(chapter.value?.num ?? 1))
  const nextChapter = computed(() => chapterAt(1, chId.value))
  const prevChapter = computed(() => chapterAt(-1, chId.value))
  const atEnd = computed(() => index.value >= slides.value.length - 1)
  /** key under which this slide's drawings are stored and synced */
  const drawKey = computed(() => `${chId.value}/${index.value}`)

  watch(chId, async (id) => {
    if (!chapterById(id)) { router.replace('/'); return }
    loading.value = true
    const loaded = await loadChapter(id)
    if (id !== chId.value) return
    slides.value = loaded
    loading.value = false
  }, { immediate: true })

  watch([chId, index, chapter], () => {
    if (!chapter.value) return
    visit(chId.value, index.value)
    const tag = role === 'presenter' ? '講師 · ' : ''
    document.title = `${tag}Ch ${chapter.value.num} ${chapter.value.title} · ${index.value + 1}/${chapter.value.count}`
  }, { immediate: true })

  function go(i: number, ch = chId.value, remote = false) {
    if (ch === chId.value && i === index.value) return
    router.push(`${prefix}/${ch}/${i + 1}`)
    // the presenter always drives; an audience window only talks back while a presenter is open
    if (!remote && (role === 'presenter' || linked.value)) send({ t: 'nav', ch, i })
  }
  function next() {
    if (!atEnd.value) go(index.value + 1)
    else if (nextChapter.value) go(0, nextChapter.value.id)
  }
  function prev() {
    if (index.value > 0) go(index.value - 1)
    else if (prevChapter.value) go(prevChapter.value.count - 1, prevChapter.value.id)
  }

  /** Handles navigation and drawing shortcuts. Returns true when the key was used. */
  function handleKey(e: KeyboardEvent): boolean {
    const t = e.target as HTMLElement
    if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return false
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault()
      e.shiftKey ? redo(drawKey.value) : undo(drawKey.value)
      return true
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return false
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter':
        if ((e.key === ' ' || e.key === 'Enter') && t.closest('button, a')) return false
        e.preventDefault(); next(); return true
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace':
        e.preventDefault(); prev(); return true
      case 'Home': e.preventDefault(); go(0); return true
      case 'End': e.preventDefault(); go(slides.value.length - 1); return true
      case 'd': case 'D': draw.tool = draw.tool === 'pen' ? 'none' : 'pen'; return true
      case 'h': case 'H': draw.tool = draw.tool === 'marker' ? 'none' : 'marker'; return true
      case 'l': case 'L': draw.tool = draw.tool === 'laser' ? 'none' : 'laser'; return true
      case 'e': case 'E': draw.tool = draw.tool === 'eraser' ? 'none' : 'eraser'; return true
      case 'c': case 'C': clearPage(drawKey.value); return true
    }
    return false
  }

  let leave: (() => void) | undefined
  let offNav: (() => void) | undefined
  let offHere: (() => void) | undefined
  onMounted(() => {
    leave = join(role)
    offNav = on('nav', m => go(m.i, m.ch, true))
    // a newly opened audience window is brought to the presenter's current slide
    if (role === 'presenter') offHere = on('here', () => send({ t: 'nav', ch: chId.value, i: index.value }))
  })
  onBeforeUnmount(() => { leave?.(); offNav?.(); offHere?.() })

  return { chId, chapter, slides, loading, index, slide, unit, nextChapter, prevChapter, atEnd, drawKey, go, next, prev, handleKey }
}
