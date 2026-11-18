import type { CourseInfo } from './deck'

/** Units come from `units:` in each course's course.yaml (`from`/`to` are chapter numbers, inclusive). */
export type Unit = CourseInfo['units'][number]

export const unitOf = (course: CourseInfo | undefined, num: number): Unit =>
  course?.units.find(u => num >= u.from && num <= u.to) ?? course?.units[0] ?? { title: '', desc: '', from: 0, to: 999, color: 'green' }
