import { animate } from 'motion'
import { onMounted, watch, type Ref } from 'vue'

export interface Pose { x?: number, y?: number, opacity?: number, scale?: number, rotate?: number }

/**
 * Moves elements marked with data-actor="name" between poses as `state` changes.
 * `poses[name][k]` is the pose in state k; when a list is shorter than the state, its last pose stays.
 */
export function usePoses(root: Ref<HTMLElement | undefined>, state: Ref<number>, poses: Record<string, Pose[]>, animated: () => boolean) {
  const base: Required<Pose> = { x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }
  const poseAt = (name: string, k: number) => ({ ...base, ...poses[name][Math.min(k, poses[name].length - 1)] })
  function apply(k: number, instant: boolean) {
    for (const el of root.value?.querySelectorAll<HTMLElement>('[data-actor]') ?? []) {
      const name = el.dataset.actor!
      if (!poses[name]) continue
      animate(el, poseAt(name, k), instant ? { duration: 0 } : { type: 'spring', stiffness: 150, damping: 20 })
    }
  }
  onMounted(() => {
    apply(state.value, true)
    watch(state, k => apply(k, !animated()))
  })
}
