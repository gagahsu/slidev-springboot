import { computed, reactive, watch } from 'vue'
import { legacyCourse } from './deck'
import { room } from './room'

/**
 * Preferences, remembered per browser.
 * - `interactive` (site-wide) is off for recorded lessons: polls become "think about it" quizzes and
 *   the classroom features (remote room, student questions, join by code) are hidden.
 * - `routes` (per course): 完整課程 `full` or 精簡路線 `lite`.
 */
const KEY = 'deck-settings'
type Route = 'full' | 'lite'
export const settings = reactive({ interactive: false, routes: {} as Record<string, Route> })

function load(raw: string | null) {
  try {
    const v = JSON.parse(raw ?? '{}')
    settings.interactive = !!v.interactive
    const routes: Record<string, Route> = {}
    for (const [k, r] of Object.entries(v.routes ?? {})) routes[k] = r === 'lite' ? 'lite' : 'full'
    // before there were several courses, `route` belonged to the only course
    if (v.route === 'lite' && legacyCourse && !(legacyCourse.id in routes)) routes[legacyCourse.id] = 'lite'
    settings.routes = routes
  }
  catch { settings.interactive = false; settings.routes = {} }
}
try { load(localStorage.getItem(KEY)) }
catch {}
watch(settings, (s) => {
  try { localStorage.setItem(KEY, JSON.stringify({ interactive: s.interactive, routes: s.routes })) }
  catch {}
}, { deep: true })
// the audience window and the presenter window share the settings
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => { if (e.key === KEY) load(e.newValue) })
}

/** Live classroom features are on: chosen by the presenter, or this device joined a teacher's room. */
export const liveClass = computed(() => settings.interactive || (room.status === 'on' && !room.canControl))
