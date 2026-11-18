import { courseById, type CourseInfo } from './deck'
import { settings } from './settings'

/**
 * 精簡路線 (lite route), per course: chapters listed in `lite.optional` of course.yaml are hidden on
 * the course home and sidebar and skipped by next/previous chapter. The choice is stored per course.
 */
export const hasLite = (course: CourseInfo | undefined) => !!course?.lite
export const isLite = (course: CourseInfo | undefined) => !!course?.lite && settings.routes[course.id] === 'lite'
export function setRoute(course: CourseInfo, route: 'full' | 'lite') { settings.routes[course.id] = route }
export const isOptional = (course: CourseInfo | undefined, num: number) => !!course?.lite?.optional.includes(num)

/** chapters on the current route of the course (all of them on the full route) */
export function routeChapters(course: CourseInfo) {
  return isLite(course) ? course.chapters.filter(c => !isOptional(course, c.num)) : course.chapters
}

/** the chapter `offset` steps away from `id` on the current route (skips optional chapters on the lite route) */
export function routeChapterAt(courseId: string, offset: number, id: string) {
  const course = courseById(courseId)
  if (!course) return undefined
  const lite = isLite(course)
  const list = course.chapters.filter(c => c.id === id || !lite || !isOptional(course, c.num))
  return list[list.findIndex(c => c.id === id) + offset]
}
