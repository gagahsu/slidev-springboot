import { computed, ref } from 'vue'
import { courseById } from './deck'

/**
 * The course whose pages are on screen (`:course` in the URL), set by the router before each page
 * renders. Empty on the course picker and the join page.
 */
export const currentCourseId = ref('')
export const currentCourse = computed(() => courseById(currentCourseId.value))
