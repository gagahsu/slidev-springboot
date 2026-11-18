import { chapterById, courseById, tracks, type ChapterInfo, type CourseInfo, type TrackInfo } from './deck'
import { courseProgress } from './progress'

/**
 * Learning tracks (學程, `tracks/<id>.yaml`): ordered stages of chapters taken from several courses.
 * A chapter that is not on the site yet, and every `soon` item, shows as 準備中 and is skipped by navigation.
 */
export type TrackItem =
  | { kind: 'chapter', course: CourseInfo, ch: ChapterInfo }
  | { kind: 'soon', label: string, course?: CourseInfo, courseId: string, note: string }

export interface TrackStage { title: string, desc: string, items: TrackItem[] }

const byId = new Map(tracks.map(t => [t.id, t]))
export const trackById = (id: unknown) => (typeof id === 'string' ? byId.get(id) : undefined)

const resolved = new Map<string, TrackStage[]>()
export function trackStages(t: TrackInfo): TrackStage[] {
  let stages = resolved.get(t.id)
  if (stages) return stages
  stages = t.stages.map(st => ({
    title: st.title,
    desc: st.desc,
    items: st.items.map((it): TrackItem => {
      if ('soon' in it) return { kind: 'soon', label: it.soon, course: courseById(it.course), courseId: it.course, note: it.note }
      const course = courseById(it.course)
      const ch = course && chapterById(course.id, it.ch)
      if (course && ch) return { kind: 'chapter', course, ch }
      return { kind: 'soon', label: `${course?.short ?? it.course} ${it.ch.replace('ch', 'Ch ')}`, course, courseId: it.course, note: '尚未放進網站' }
    }),
  }))
  resolved.set(t.id, stages)
  return stages
}

type ChapterItem = Extract<TrackItem, { kind: 'chapter' }>
/** chapters of the track in order, with the stage they belong to */
export function trackChapters(t: TrackInfo): (ChapterItem & { stage: number })[] {
  return trackStages(t).flatMap((st, si) => st.items.filter((i): i is ChapterItem => i.kind === 'chapter').map(i => ({ ...i, stage: si })))
}

/** where a chapter sits in the track, or -1 */
export const trackIndexOf = (t: TrackInfo, course: string, ch: string) =>
  trackChapters(t).findIndex(i => i.course.id === course && i.ch.id === ch)

/** the chapter `offset` steps away on the track (only chapters that are on the site) */
export function trackNeighbor(t: TrackInfo, course: string, ch: string, offset: number) {
  const list = trackChapters(t)
  const at = list.findIndex(i => i.course.id === course && i.ch.id === ch)
  return at < 0 ? undefined : list[at + offset]
}

/** slides seen / total for one chapter, from the course's own progress */
export function chapterDone(course: string, ch: ChapterInfo) {
  const seen = courseProgress(course).seen[ch.id]
  return seen === undefined ? 0 : Math.min(ch.count, seen + 1)
}
export const chapterFinished = (course: string, ch: ChapterInfo) => chapterDone(course, ch) >= ch.count

/** percentage of the slides of these chapters that were reached */
export function itemsPct(items: TrackItem[]) {
  let done = 0
  let total = 0
  for (const i of items) {
    if (i.kind !== 'chapter') continue
    done += chapterDone(i.course.id, i.ch)
    total += i.ch.count
  }
  return total ? Math.round(done / total * 100) : 0
}

/** 「繼續學程」: the first chapter of the track that is not finished */
export function nextUnfinished(t: TrackInfo) {
  return trackChapters(t).find(i => !chapterFinished(i.course.id, i.ch))
}
