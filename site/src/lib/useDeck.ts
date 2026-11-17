import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { chapterById, loadChapter, type Slide } from './deck'
import { routeChapterAt } from './route'
import { clearPage, draw, redo, undo } from './draw'
import { visit } from './progress'
import { room } from './room'
import { LAST_STEP } from './steps'
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
  const nextChapter = computed(() => routeChapterAt(1, chId.value))
  const prevChapter = computed(() => routeChapterAt(-1, chId.value))
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

  /** animation step inside the current slide, and how many steps the slide has (reported by SlideCanvas) */
  const step = ref(0)
  const stepTotal = ref(0)
  const stepShown = computed(() => Math.min(step.value, stepTotal.value))

  function go(i: number, ch = chId.value, remote = false, toStep = 0) {
    const sameSlide = ch === chId.value && i === index.value
    if (sameSlide && toStep === step.value) return
    // a student who turns pages on their own stops following until they choose to catch up
    if (!remote && role === 'audience' && room.status === 'on' && !room.canControl) room.following = false
    if (!sameSlide) {
      stepTotal.value = 0
      router.push(`${prefix}/${ch}/${i + 1}`)
    }
    step.value = toStep
    // the presenter always drives; an audience window only talks back while a presenter is open
    if (!remote && (role === 'presenter' || linked.value)) send({ t: 'nav', ch, i, step: toStep })
  }
  /** next step, or the next slide once the steps are used up */
  function next() {
    if (step.value < stepTotal.value) go(index.value, chId.value, false, step.value + 1)
    else if (!atEnd.value) go(index.value + 1)
    else if (nextChapter.value) go(0, nextChapter.value.id)
  }
  /** previous step, or the previous slide in its final state */
  function prev() {
    if (stepShown.value > 0) go(index.value, chId.value, false, stepShown.value - 1)
    else if (index.value > 0) go(index.value - 1, chId.value, false, LAST_STEP)
    else if (prevChapter.value) go(prevChapter.value.count - 1, prevChapter.value.id, false, LAST_STEP)
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
    // arriving from the join page: start on the presenter's animation step, not at step 0
    const at = room.presenterAt
    if (at && at.ch === chId.value && at.i === index.value) step.value = at.step
    offNav = on('nav', (m, _e, origin) => {
      if (origin.remote) {
        room.presenterAt = { ch: m.ch, i: m.i, step: m.step ?? 0 }
        if (!room.following && !room.canControl) return
      }
      go(m.i, m.ch, true, m.step ?? 0)
    })
    // a newly opened audience window is brought to the presenter's current slide
    if (role === 'presenter') offHere = on('here', () => send({ t: 'nav', ch: chId.value, i: index.value, step: step.value }))
  })
  onBeforeUnmount(() => { leave?.(); offNav?.(); offHere?.() })

  /** student: jump back to where the presenter is */
  function catchUp() {
    room.following = true
    const at = room.presenterAt
    if (at) go(at.i, at.ch, true, at.step)
  }

  return { catchUp, chId, chapter, slides, loading, index, slide, unit, nextChapter, prevChapter, atEnd, drawKey, step, stepTotal, stepShown, go, next, prev, handleKey }
}
