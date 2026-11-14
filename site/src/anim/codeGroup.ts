import type { InjectionKey, Ref } from 'vue'

/** Lets <CodeSteps> show the caption that belongs to the current state of the <StepCode> inside it. */
export const CODE_GROUP: InjectionKey<{ state: Ref<number> }> = Symbol('code-group')
