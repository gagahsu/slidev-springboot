import { markRaw, type Component } from 'vue'
import { courses, loaders, searchLoaders, type ChapterInfo, type CourseInfo, type SearchDoc } from 'virtual:deck'

export interface Slide {
  index: number
  /** unique across courses and chapters, e.g. `springboot/ch04-2` */
  key: string
  layout: string
  class: string
  title: string
  note: string
  /** n-th section divider in the chapter (0 = not a section slide) */
  section: number
  comp: Component
}

export { courses }
export type { ChapterInfo, CourseInfo, SearchDoc }

export const SLIDE_W = 980
export const SLIDE_H = 552

const byId = new Map(courses.map(c => [c.id, c]))
const chapterMaps = new Map(courses.map(c => [c.id, new Map(c.chapters.map(ch => [ch.id, ch]))]))
export const courseById = (id: string | undefined) => (id ? byId.get(id) : undefined)
export const chapterById = (course: string, id: string) => chapterMaps.get(course)?.get(id)
/** the course that answers the URLs from before there were several courses (#/ch04/3) */
export const legacyCourse = courses.find(c => c.legacy) ?? courses[0]
export const slideCount = (c: CourseInfo, list = c.chapters) => list.reduce((n, ch) => n + ch.count, 0)

const cache = new Map<string, Promise<Slide[]>>()
export function loadChapter(course: string, id: string): Promise<Slide[]> {
  const k = `${course}/${id}`
  let p = cache.get(k)
  if (!p) {
    const loader = loaders[k]
    p = loader
      ? loader().then(m => m.default.map(s => markRaw({ ...s, key: `${k}-${s.index}`, comp: markRaw({ name: 'SlideContent', render: s.render }) }) as Slide))
      : Promise.resolve([])
    cache.set(k, p)
  }
  return p
}

const searchCache = new Map<string, Promise<SearchDoc[]>>()
/** search index of one course: one entry per slide */
export function loadSearch(course: string): Promise<SearchDoc[]> {
  let p = searchCache.get(course)
  if (!p) {
    const loader = searchLoaders[course]
    p = loader ? loader().then(m => m.default) : Promise.resolve([])
    searchCache.set(course, p)
  }
  return p
}
