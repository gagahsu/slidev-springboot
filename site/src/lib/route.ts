import { computed } from 'vue'
import { chapters } from './deck'
import { settings } from './settings'

/**
 * 精簡路線: only the chapters needed to build the survey project backend (ch49–52).
 * These chapters are skipped; everything they introduce is either unused by the project or
 * re-taught elsewhere. ch07 / ch24–25 / ch34 / ch40 stay because they first introduce Lombok,
 * Map, ResponseEntity and @Configuration/@Bean.
 */
export const OPTIONAL_CHAPTERS = new Set([8, 10, 11, 30, 31, 32, 35, 43, 44, 45, 48])

export const lite = computed(() => settings.route === 'lite')
export const isOptional = (num: number) => OPTIONAL_CHAPTERS.has(num)
/** chapters on the current route (all of them on the full route) */
export const routeChapters = computed(() => lite.value ? chapters.filter(c => !isOptional(c.num)) : chapters)

/** the chapter `offset` steps away from `id` on the current route (skips optional chapters on the lite route) */
export function routeChapterAt(offset: number, id: string) {
  const list = chapters.filter(c => c.id === id || !lite.value || !isOptional(c.num))
  return list[list.findIndex(c => c.id === id) + offset]
}
