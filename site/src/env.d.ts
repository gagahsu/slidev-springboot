declare module 'virtual:deck' {
  export interface OutlineItem { t: string, l: string }
  export interface ChapterInfo { id: string, num: number, title: string, subtitle: string, count: number, outline: OutlineItem[] }
  export interface UnitInfo { title: string, desc: string, from: number, to: number, color: string }
  export interface CourseInfo {
    id: string
    title: string
    short: string
    description: string
    logo: string
    color: string
    /** answers the URLs from before there were several courses (#/ch04/3) */
    legacy: boolean
    searchHint: string
    pdfName: string
    units: UnitInfo[]
    lite: { description: string, optional: number[] } | null
    chapters: ChapterInfo[]
  }
  export interface SearchDoc { c: string, i: number, t: string, x: string }
  /** an item of a learning track: a chapter of a course, or content still to come (`soon`) */
  export type TrackItemRaw = { course: string, ch: string } | { soon: string, course: string, note: string }
  export interface TrackInfo {
    id: string
    title: string
    short: string
    description: string
    logo: string
    color: string
    order: number
    project: string
    stages: { title: string, desc: string, items: TrackItemRaw[] }[]
  }
  export const tracks: TrackInfo[]
  export const courses: CourseInfo[]
  /** key: `<course>/chNN` */
  export const loaders: Record<string, () => Promise<{ default: any[] }>>
  export const searchLoaders: Record<string, () => Promise<{ default: SearchDoc[] }>>
}
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const c: DefineComponent<any, any, any>
  export default c
}
