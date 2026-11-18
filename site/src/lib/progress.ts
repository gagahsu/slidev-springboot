import { reactive, watch } from 'vue'
import { legacyCourse } from './deck'

interface CourseProgress {
  last: { ch: string, i: number } | null
  /** furthest slide index reached per chapter */
  seen: Record<string, number>
}
interface Progress {
  /** the last slide viewed on the whole site (for 「繼續上次的進度」 on the course picker) */
  last: { course: string, ch: string, i: number } | null
  courses: Record<string, CourseProgress>
}

const KEY = 'deck-progress-v2'
/** single-course format, moved into the legacy course on first load */
const OLD_KEY = 'deck-progress-v1'

function read(): Progress {
  const empty: Progress = { last: null, courses: {} }
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...empty, ...JSON.parse(raw) }
    const old = localStorage.getItem(OLD_KEY)
    if (old && legacyCourse) {
      const v = JSON.parse(old)
      const id = legacyCourse.id
      return {
        last: v.last ? { course: id, ...v.last } : null,
        courses: { [id]: { last: v.last ?? null, seen: v.seen ?? {} } },
      }
    }
  }
  catch {}
  return empty
}

export const progress = reactive<Progress>(read())

watch(progress, (p) => {
  try { localStorage.setItem(KEY, JSON.stringify(p)) }
  catch {}
}, { deep: true, immediate: true })

export const courseProgress = (course: string): CourseProgress => progress.courses[course] ?? { last: null, seen: {} }

export function visit(course: string, ch: string, i: number) {
  const p = progress.courses[course] ?? (progress.courses[course] = { last: null, seen: {} })
  p.last = { ch, i }
  if ((p.seen[ch] ?? -1) < i) p.seen[ch] = i
  progress.last = { course, ch, i }
}

/** percentage of a chapter's slides reached */
export function chapterPct(course: string, id: string, count: number) {
  const seen = progress.courses[course]?.seen[id]
  return seen === undefined ? 0 : Math.round((seen + 1) / count * 100)
}
