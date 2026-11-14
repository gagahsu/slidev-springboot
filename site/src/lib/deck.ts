import { markRaw, type Component } from 'vue'
import { chapters, loaders, type ChapterInfo } from 'virtual:deck'

export interface Slide {
  index: number
  layout: string
  class: string
  title: string
  note: string
  /** n-th section divider in the chapter (0 = not a section slide) */
  section: number
  comp: Component
}

export { chapters }
export type { ChapterInfo }

export const SLIDE_W = 980
export const SLIDE_H = 552

const byId = new Map(chapters.map(c => [c.id, c]))
export const chapterById = (id: string) => byId.get(id)
export const chapterAt = (offset: number, id: string) => chapters[chapters.findIndex(c => c.id === id) + offset]
export const totalSlides = chapters.reduce((n, c) => n + c.count, 0)

const cache = new Map<string, Promise<Slide[]>>()
export function loadChapter(id: string): Promise<Slide[]> {
  let p = cache.get(id)
  if (!p) {
    const loader = loaders[id]
    p = loader
      ? loader().then(m => m.default.map(s => markRaw({ ...s, comp: markRaw({ name: 'SlideContent', render: s.render }) }) as Slide))
      : Promise.resolve([])
    cache.set(id, p)
  }
  return p
}
