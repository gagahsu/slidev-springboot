import { computed, inject, onMounted, ref, type ComputedRef, type InjectionKey, type Ref } from 'vue'

/**
 * Steps ("clicks") inside one slide. SlideCanvas provides the context; animated components
 * claim a number of steps when they mount (in document order) and read their local position.
 */
export interface StepContext {
  /** current step of the slide; Infinity when the slide is shown in its final state (previews, thumbnails) */
  step: ComputedRef<number>
  /** false for previews/thumbnails: show the final state and skip animations */
  live: ComputedRef<boolean>
  claim: (count: number) => number
}

export const STEP_CONTEXT: InjectionKey<StepContext> = Symbol('deck-steps')
/** "last step" marker that survives JSON (used when navigating backwards into a slide) */
export const LAST_STEP = 9999

export const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

export function useSteps() {
  const ctx = inject(STEP_CONTEXT, null)
  const start = ref(0)
  const count = ref(0)
  /** 0..count: how many of this component's steps have been played */
  const local: Ref<number> = computed(() => {
    if (!ctx) return count.value
    return Math.max(0, Math.min(count.value, ctx.step.value - start.value))
  })
  const live = computed(() => !!ctx?.live.value)
  /** animate only on the live slide and when the viewer has not asked for reduced motion */
  const animated = () => live.value && !reducedMotion()
  function claim(n: number) {
    count.value = n
    start.value = ctx ? ctx.claim(n) : 0
  }
  return { local, live, animated, claim, count }
}

/** Convenience for components with a fixed number of steps. */
export function useFixedSteps(n: number) {
  const s = useSteps()
  onMounted(() => s.claim(n))
  return s
}
