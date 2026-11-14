declare module 'virtual:deck' {
  export interface OutlineItem { t: string, l: string }
  export interface ChapterInfo { id: string, num: number, title: string, subtitle: string, count: number, outline: OutlineItem[] }
  export const chapters: ChapterInfo[]
  export const loaders: Record<string, () => Promise<{ default: any[] }>>
}
declare module 'virtual:deck-search' {
  const docs: { c: string, i: number, t: string, x: string }[]
  export default docs
}
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const c: DefineComponent<any, any, any>
  export default c
}
