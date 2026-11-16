import { computed, reactive, watch } from 'vue'
import { room } from './room'

/**
 * Presenter preferences, remembered per browser.
 * `interactive` is off for recorded lessons: polls become "think about it" quizzes and the
 * classroom features (remote room, student questions, join by code) are hidden.
 */
const KEY = 'deck-settings'
export const settings = reactive({ interactive: false })

function load(raw: string | null) {
  try { settings.interactive = !!JSON.parse(raw ?? '{}').interactive }
  catch { settings.interactive = false }
}
try { load(localStorage.getItem(KEY)) }
catch {}
watch(settings, (s) => {
  try { localStorage.setItem(KEY, JSON.stringify(s)) }
  catch {}
})
// the audience window and the presenter window share the setting
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => { if (e.key === KEY) load(e.newValue) })
}

/** Live classroom features are on: chosen by the presenter, or this device joined a teacher's room. */
export const liveClass = computed(() => settings.interactive || (room.status === 'on' && !room.canControl))
